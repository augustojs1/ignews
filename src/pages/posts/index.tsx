import { GetStaticProps } from "next";
import Head from "next/head";
import { getPrismicClient } from "../../services/prismic";
import styles from "./styles.module.scss";
import Prismic from "@prismicio/client";

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Repudiandae officiis adipisci iure recusandae, minima accusantium!
              Ipsa blanditiis tenetur dolore ex! Dolorum corporis rem
              consequuntur, obcaecati animi asperiores nihil perferendis
              excepturi!
            </p>
          </a>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Repudiandae officiis adipisci iure recusandae, minima accusantium!
              Ipsa blanditiis tenetur dolore ex! Dolorum corporis rem
              consequuntur, obcaecati animi asperiores nihil perferendis
              excepturi!
            </p>
          </a>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Repudiandae officiis adipisci iure recusandae, minima accusantium!
              Ipsa blanditiis tenetur dolore ex! Dolorum corporis rem
              consequuntur, obcaecati animi asperiores nihil perferendis
              excepturi!
            </p>
          </a>
        </div>
      </main>
    </>
  );
}

// Conteúdo da página será renderizado através do servidor (SSR).
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  // Buscando os posts no Prismic CMS.
  const response = await prismic.query(
    [Prismic.predicates.at("document.type", "publication")],
    {
      fetch: ["publication.title", "publication.content"],
      pageSize: 100,
    }
  );

  console.log("prismic-posts", JSON.stringify(response, null, 2));

  return {
    props: {},
  };
};
