import { commentCollection, userCollection } from "../../../db/mongo.db";
import { BlogModel } from "../../../entity/blogs/domain/dto/blog.entity";
import { PostModel } from "../../../entity/posts/domain/dto/post.entity";
import { UserModel } from "../../../entity/user/domain/dto/user.entity";

export const testRepository = {
  async deleteBlogsAndPost(): Promise<void> {
    await PostModel.deleteMany();
    await BlogModel.deleteMany();
    await UserModel.deleteMany();
    await commentCollection.deleteMany();
    return;
  }
};
