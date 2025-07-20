import {
  blogCollection,
  commentCollection,
  postCollection,
  userCollection
} from "../../../db/mongo.db";

export const testRepository = {
  async deleteBlogsAndPost(): Promise<void> {
    await postCollection.deleteMany();
    await blogCollection.deleteMany();
    await userCollection.deleteMany();
    await commentCollection.deleteMany();
    return;
  }
};
