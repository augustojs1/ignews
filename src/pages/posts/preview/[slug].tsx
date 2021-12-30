// Como a página da postagem a ser montada pelo servidor é dinâmica criamos um slug para receber esses dados do post e montar dinamicamente.
// A rota para cá seria http://localhost:3000/posts/qualquer-coisa-apos-post
// Isso redireciona para essa página.
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";

import styles from "../post.module.scss";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

// Recebendo o objeto post da função getServerSideProps. Vamos receber os dados como props e montar a página.
export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession();

  useEffect(() => {}, [session]);

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
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?{" "}
            <Link href="/">
              <a href="">Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

// Essa será uma página estática (SSG) pois não depende de nenhuma lógica por parte do servidor para renderizar o conteúdo. É uma página publica que todos podem ver.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Pegando o slug que a página dinâmica está recebendo. (params.slug)
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID("publication", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
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
