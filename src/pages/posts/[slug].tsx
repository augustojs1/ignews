// Como a página da postagem a ser montada pelo servidor é dinâmica criamos um slug para receber esses dados do post e montar dinamicamente.
// A rota para cá seria http://localhost:3000/posts/qualquer-coisa-apos-post
// Isso redireciona para essa página.

import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";

import styles from "./post.module.scss";

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

// Recebendo o objeto post da função getServerSideProps. Vamos receber os dados como props e montar a página.
export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });

  // Pegando o slug que a página dinâmica está recebendo. (params.slug)
  const { slug } = params;

  // COnferindo se o usuário possui uma assinatura ativa e redireciona ele pra home caso não.
  // if (!session.activeSubscription) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }

  const prismic = getPrismicClient(req);
  const response = await prismic.getByUID("publication", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  // Retornando a postagem para o componente consumir e montar a página estática de conteúdo.
  return {
    props: {
      post,
    },
  };
};
