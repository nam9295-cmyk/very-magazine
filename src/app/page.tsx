import { PostsFeed } from "@/components/magazine/posts-feed";
import {
  listAvailableCategories,
  listPostsPage,
  POSTS_PAGE_SIZE,
  type MagazinePost,
} from "@/lib/magazine-posts";

export const dynamic = "force-dynamic";

type HomeData = {
  categories: string[];
  hasMore: boolean;
  hasUncategorized: boolean;
  posts: MagazinePost[];
  total: number;
};

async function getHomeData() {
  try {
    const [{ posts, hasMore, total }, { categories, hasUncategorized }] = await Promise.all([
      listPostsPage({
        limit: POSTS_PAGE_SIZE,
      }),
      listAvailableCategories(),
    ]);

    const data: HomeData = {
      categories,
      hasMore,
      hasUncategorized,
      posts,
      total,
    };

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: {
        categories: [],
        hasMore: false,
        hasUncategorized: false,
        posts: [] as MagazinePost[],
        total: 0,
      },
      error: error instanceof Error ? error.message : "Failed to load magazine posts.",
    };
  }
}

export default async function Home() {
  const { data, error } = await getHomeData();

  return (
    <PostsFeed
      availableCategories={data.categories}
      hasUncategorized={data.hasUncategorized}
      initialError={error}
      initialHasMore={data.hasMore}
      initialPosts={data.posts}
      initialTotal={data.total}
    />
  );
}
