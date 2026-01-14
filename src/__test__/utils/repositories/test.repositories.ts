import {
  commentCollection,
  postCollection,
  userCollection
} from "../../../db/mongo.db";
import { BlogModel } from "../../../entity/blogs/domain/dto/blog.entity";

export const testRepository = {
  async deleteBlogsAndPost(): Promise<void> {
    await postCollection.deleteMany();
    await BlogModel.deleteMany();
    await userCollection.deleteMany();
    await commentCollection.deleteMany();
    return;
  }
};
