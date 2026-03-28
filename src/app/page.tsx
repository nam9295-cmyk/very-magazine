import { type Models, Query } from "appwrite";

import { PostsFeed } from "@/components/magazine/posts-feed";
import { appwriteConfig, createAppwriteDatabases } from "@/lib/appwrite";

export const dynamic = "force-dynamic";

export type MagazinePost = Models.Document & {
  title?: string;
  eng_title?: string;
  kor_summary?: string;
  eng_summary?: string;
  image_url?: string;
  original_url?: string;
  category?: string;
};

async function getPosts() {
  try {
    const databases = createAppwriteDatabases();
    const response = await databases.listDocuments<MagazinePost>({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.collectionId,
      queries: [Query.orderDesc("$createdAt"), Query.limit(50)],
    });

    return {
      posts: response.documents.map((document) => ({
        ...document,
      })),
      error: null,
    };
  } catch (error) {
    return {
      posts: [] as MagazinePost[],
      error: error instanceof Error ? error.message : "Failed to load magazine posts.",
    };
  }
}

export default async function Home() {
  const { posts, error } = await getPosts();

  return <PostsFeed initialPosts={posts} initialError={error} />;
}
