import { Collection, Db, MongoClient, ServerApiVersion } from "mongodb";
import { Blog } from "../entity/blogs/types/blog";
import { Post } from "../entity/posts/types/post";
import { User } from "../entity/user/types/user";
import { Comment } from "../entity/comments/types/comment";

const BLOG_COLLECTION_NAME = "blog";
const POST_COLLECTION_NAME = "post";
const USER_COLLECTION_NAME = "user";
const COMMENT_COLLECTION_NAME = "comment";

export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;
export let commentCollection: Collection<Comment>;

export async function stopDb() {
  if (!client) {
    throw new Error(`❌ Database not connected`);
  }
  await client.close();
}

// Подключения к бд
export const runDB = async (): Promise<void> => {
  // LOCAL
  // client = new MongoClient(process.env.MONGODB_LOCAL ?? "", {
  // TEST
  //client = new MongoClient("mongodb://localhost:27017", {
  //INCUB
  client = new MongoClient(process.env.MONGODB_URI ?? "", {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });
  const db: Db = client.db("blog");

  //Инициализация коллекций
  blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<Post>(POST_COLLECTION_NAME);
  userCollection = db.collection<User>(USER_COLLECTION_NAME);
  commentCollection = db.collection<Comment>(COMMENT_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("✅ Connected to the database");
  } catch (e) {
    await stopDb();
  }
};
