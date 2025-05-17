// const {MongoClient, ServerApiVersion} = require('mongodb');
// const uri = "mongodb+srv://admin:admin@mongo01.qwr8sxq.mongodb.net/?retryWrites=true&w=majority&appName=mongo01";
//
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
//
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ping: 1});
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
//
// run().catch(console.dir);

import {Collection, Db, MongoClient} from 'mongodb';
import {Blog} from '../blogs/types/blog';
import {Post} from "../posts/types/post";
// import { SETTINGS } from '../core/settings/settings';

const BLOG_COLLECTION_NAME = 'blog';
const POST_COLLECTION_NAME = 'post';

export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;

// Подключения к бд
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db('blog');

  //Инициализация коллекций
  blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<Post>(POST_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ping: 1});
    console.log('✅ Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}