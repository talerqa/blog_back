import { Collection, Db, MongoClient } from "mongodb";
import { Blog } from "../entity/blogs/types/blog";
import { Post } from "../entity/posts/types/post";
import { User } from "../entity/user/types/user";
import { Comment } from "../entity/comments/types/comment";
import {
  BLOG_COLLECTION_NAME,
  COMMENT_COLLECTION_NAME,
  NAME_DB,
  POST_COLLECTION_NAME,
  RATE_LIMIT_COLLECTION_NAME,
  SESSIONS_COLLECTION_NAME,
  TOKEN_COLLECTION_NAME,
  USER_COLLECTION_NAME
} from "./collectionsName";
import { Security } from "../entity/security/types/security";
import { RateLimit } from "../entity/rateLimit/types/rateLimit";
import { Token } from "../entity/auth/types/token";

export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;
export let tokenCollection: Collection<Token>;
export let commentCollection: Collection<Comment>;
export let securityCollection: Collection<Security>;
export let rateLimitCollection: Collection<RateLimit>;

export async function stopDb() {
  if (!client) {
    throw new Error(`❌ Database not connected`);
  }
  await client.close();
}

// Подключения к бд
export const runDB = async (): Promise<void> => {
  const client: MongoClient = new MongoClient("mongodb://localhost:27017");

  const db: Db = client.db(NAME_DB);
  blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<Post>(POST_COLLECTION_NAME);
  userCollection = db.collection<User>(USER_COLLECTION_NAME);
  tokenCollection = db.collection<Token>(TOKEN_COLLECTION_NAME);
  commentCollection = db.collection<Comment>(COMMENT_COLLECTION_NAME);
  securityCollection = db.collection<Security>(SESSIONS_COLLECTION_NAME);
  rateLimitCollection = db.collection<RateLimit>(RATE_LIMIT_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("✅ Connected to the database");
  } catch (e) {
    if (!client) {
      throw new Error(`❌ Database not connected`);
    }
    await client.close();
  }
};
