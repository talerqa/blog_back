import {blogCollection, postCollection} from "../../db/mongo.db";

export const testRepository = {


  async deleteBlogsAndPost(): Promise<any> {
    await postCollection.deleteMany();
    await blogCollection.deleteMany();
    return
  },
};