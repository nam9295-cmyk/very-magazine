import { Client, Databases } from "appwrite";

type RequiredAppwriteEnv = "NEXT_PUBLIC_APPWRITE_ENDPOINT" | "NEXT_PUBLIC_APPWRITE_PROJECT_ID";
type OptionalAppwriteEnv =
  | "NEXT_PUBLIC_APPWRITE_DATABASE_ID"
  | "NEXT_PUBLIC_DATABASE_ID"
  | "NEXT_PUBLIC_APPWRITE_COLLECTION_ID"
  | "NEXT_PUBLIC_COLLECTION_ID";

function getRequiredEnv(name: RequiredAppwriteEnv) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getOptionalEnv(...names: OptionalAppwriteEnv[]) {
  for (const name of names) {
    const value = process.env[name];

    if (value) {
      return value;
    }
  }

  return undefined;
}

export const appwriteConfig = {
  get endpoint() {
    return getRequiredEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT");
  },
  get projectId() {
    return getRequiredEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID");
  },
  get databaseId() {
    const value = getOptionalEnv("NEXT_PUBLIC_APPWRITE_DATABASE_ID", "NEXT_PUBLIC_DATABASE_ID");

    if (!value) {
      throw new Error(
        "Missing required environment variable: NEXT_PUBLIC_APPWRITE_DATABASE_ID or NEXT_PUBLIC_DATABASE_ID",
      );
    }

    return value;
  },
  get collectionId() {
    return (
      getOptionalEnv("NEXT_PUBLIC_APPWRITE_COLLECTION_ID", "NEXT_PUBLIC_COLLECTION_ID") ||
      "magazine_posts"
    );
  },
} as const;

export function createAppwriteClient() {
  return new Client().setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);
}

export function createAppwriteDatabases() {
  return new Databases(createAppwriteClient());
}
