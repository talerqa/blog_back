import { blogCollection, postCollection } from "../../db/mongo.db";

export const testRepository = {
  async deleteBlogsAndPost(): Promise<void> {
    await postCollection.deleteMany();
    await blogCollection.deleteMany();
    return;
  }
};
