/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";

// O caminho para a nossa api é localhost:3000/api/webhooks por isso criamos dentro de pages/api o arquivo webhooks.ts
// src/pages/api/webhooks.ts => localhost:3000/api/webhooks
export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Evento recebido!");

  res.status(200).json({ success: true });
};
