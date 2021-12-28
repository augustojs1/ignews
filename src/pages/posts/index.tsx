import { GetStaticProps } from "next";
import Head from "next/head";
import { getPrismicClient } from "../../services/prismic";
import styles from "./styles.module.scss";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};
interface PostProps {
  posts: Post[];
}

// Pegando o posts como props que está sendo enviado pelo getStaticProps (SSR).
export default function Posts({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <a key={post.slug} href="#">
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

// Conteúdo da página será renderizado através do servidor como conteúdo estático (SSG).
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

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find((content) => content.type === "paragraph")
          ?.text ?? "",
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  // Retornando as informações dos posts para a página que irá receber elas como props pois será um conteúdo estático.
  return {
    props: {
      posts,
    },
  };
};
