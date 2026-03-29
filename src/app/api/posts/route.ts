import { NextResponse } from "next/server";

import {
  ALL_CATEGORY,
  listPostsPage,
  POSTS_PAGE_SIZE,
} from "@/lib/magazine-posts";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offsetValue = Number.parseInt(searchParams.get("offset") || "0", 10);
  const category = searchParams.get("category") || ALL_CATEGORY;
  const offset = Number.isNaN(offsetValue) || offsetValue < 0 ? 0 : offsetValue;

  try {
    const response = await listPostsPage({
      limit: POSTS_PAGE_SIZE,
      offset,
      category,
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to load magazine posts.",
      },
      { status: 500 },
    );
  }
}
