/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { SaveSubscription } from "./_lib/manageSubscription";

// Os webhooks do Stripe não envia toda a informação por completo mas sim por partes através de uma "stream". Portanto, devemos fazer um código para fazer um parse dessas informações.
async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// Tipos de eventos relevantes para nossa aplicação
const relevantEvents = new Set([
  "checkout.session.completed",
  "checkout.subscriptions.updated",
  "checkout.subscriptions.deleted",
]);

// O caminho para a nossa api é localhost:3000/api/webhooks por isso criamos dentro de pages/api o arquivo webhooks.ts
// src/pages/api/webhooks.ts => localhost:3000/api/webhooks
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Aceita apenas requisição POST para a nossa rota
  if (req.method === "POST") {
    const buf = await buffer(req);

    // Praticamente um token para autorizar somente o stripe a acessar nossa rota de webhook
    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return res.status(400).send(`Webhook error: ${error.message}`);
    }

    // Conferindo qual o tipo de evento disparado (fatura criada, fatura paga etc...)
    const { type } = event;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;

            console.log("type-subscription", type);

            await SaveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            );

            break;

          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            await SaveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );

            break;
          default:
            throw new Error("Unhandled event.");
        }
      } catch (error) {
        // sentry, bugsnag
        return res.json({ error: "Webhook handler failed." });
      }
    }

    res.status(200).json({ success: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
