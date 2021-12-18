// Importando o head podemos mudar o cabeçalho da página HTML
import { GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  //

  return (
    // Alterando o title da home.
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome!</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />{" "}
            <span>for {product.amount} month</span>{" "}
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Coding girl" />
      </main>
    </>
  );
}

// getServerSideProps (SSR): Qualquer props que retornarmos nessa função podemos passar em Home(props) e utilizar as props.
// getStaticPros (SSG): Com SSG a página é salva após renderizar o conteúdo uma vez e sempre vai o renderizar já pronto e estático até o final do seu período de revalidate
export const getStaticProps: GetStaticProps = async () => {
  // Os console.log() aqui aparecem no console do VScode pois essa função roda no servidor Node.js intermediário.
  const price = await stripe.prices.retrieve("price_1K7pnYGWZuqDzUxVJWRJjtoF");

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
