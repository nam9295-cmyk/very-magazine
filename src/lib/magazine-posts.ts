import { type Models, Query } from "appwrite";

import { appwriteConfig, createAppwriteDatabases } from "@/lib/appwrite";

export const POSTS_PAGE_SIZE = 12;
export const ALL_CATEGORY = "__all__";
export const UNCATEGORIZED_CATEGORY = "__uncategorized__";
export const UNCATEGORIZED_LABEL = "Uncategorized";
const CATEGORY_SCAN_CHUNK_SIZE = 100;

export type MagazinePost = Models.Document & {
  title?: string;
  eng_title?: string;
  kor_summary?: string;
  eng_summary?: string;
  image_url?: string;
  original_url?: string;
  category?: string;
};

export type PostsPage = {
  posts: MagazinePost[];
  hasMore: boolean;
  total: number;
};

function normalizePost(document: MagazinePost) {
  return {
    ...document,
  };
}

export function normalizeCategoryValue(category?: string | null) {
  const normalized = category?.trim();

  return normalized || UNCATEGORIZED_CATEGORY;
}

async function listCollectionDocuments(limit: number, offset: number) {
  const databases = createAppwriteDatabases();

  const response = await databases.listDocuments<MagazinePost>({
    databaseId: appwriteConfig.databaseId,
    collectionId: appwriteConfig.collectionId,
    queries: [Query.orderDesc("$createdAt"), Query.limit(limit), Query.offset(offset)],
  });

  return {
    documents: response.documents.map(normalizePost),
    total: response.total,
  };
}

async function listUncategorizedPostsPage(offset: number, limit: number): Promise<PostsPage> {
  let collectionOffset = 0;
  let skipped = 0;
  let total = 0;
  const collected: MagazinePost[] = [];

  while (true) {
    const { documents } = await listCollectionDocuments(CATEGORY_SCAN_CHUNK_SIZE, collectionOffset);

    if (documents.length === 0) {
      break;
    }

    const uncategorizedPosts = documents.filter(
      (post) => normalizeCategoryValue(post.category) === UNCATEGORIZED_CATEGORY,
    );

    total += uncategorizedPosts.length;

    for (const post of uncategorizedPosts) {
      if (skipped < offset) {
        skipped += 1;
        continue;
      }

      if (collected.length < limit) {
        collected.push(post);
      }
    }

    collectionOffset += documents.length;

    if (documents.length < CATEGORY_SCAN_CHUNK_SIZE) {
      break;
    }
  }

  return {
    posts: collected,
    hasMore: offset + collected.length < total,
    total,
  };
}

export async function listPostsPage({
  limit = POSTS_PAGE_SIZE,
  offset = 0,
  category = ALL_CATEGORY,
}: {
  limit?: number;
  offset?: number;
  category?: string;
}): Promise<PostsPage> {
  if (category === UNCATEGORIZED_CATEGORY) {
    return listUncategorizedPostsPage(offset, limit);
  }

  const queries = [Query.orderDesc("$createdAt"), Query.limit(limit), Query.offset(offset)];

  if (category !== ALL_CATEGORY) {
    queries.push(Query.equal("category", [category]));
  }

  const databases = createAppwriteDatabases();
  const response = await databases.listDocuments<MagazinePost>({
    databaseId: appwriteConfig.databaseId,
    collectionId: appwriteConfig.collectionId,
    queries,
  });

  const posts = response.documents.map(normalizePost);

  return {
    posts,
    hasMore: offset + posts.length < response.total,
    total: response.total,
  };
}

export async function listAvailableCategories() {
  const categories = new Set<string>();
  let hasUncategorized = false;
  let offset = 0;

  while (true) {
    const { documents } = await listCollectionDocuments(CATEGORY_SCAN_CHUNK_SIZE, offset);

    if (documents.length === 0) {
      break;
    }

    for (const post of documents) {
      const normalized = post.category?.trim();

      if (normalized) {
        categories.add(normalized);
      } else {
        hasUncategorized = true;
      }
    }

    offset += documents.length;

    if (documents.length < CATEGORY_SCAN_CHUNK_SIZE) {
      break;
    }
  }

  return {
    categories: Array.from(categories),
    hasUncategorized,
  };
}
