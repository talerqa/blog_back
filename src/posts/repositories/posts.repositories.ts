import {CreateBlogInputModel} from "../dto/createPostsInputModel";
import {UpdatePostInputModel} from "../dto/updatePostsInputModel";
import {blogCollection, postCollection} from "../../db/mongo.db";
import {ObjectId} from "mongodb";

export const postsRepository = {
  async findAllPosts(): Promise<any> {
    const posts = await postCollection.find().toArray()
    return posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt
    }))
  },

  async findBlogById(id: string): Promise<any> {


    const post = await postCollection.findOne({_id: new ObjectId(id)});

    if (!post) {
      return null
    }



    return {
      id: post?._id.toString(),
      title: post?.title,
      shortDescription: post?.shortDescription,
      content: post?.content,
      blogId: post?.blogId,
      blogName: post?.blogName,
      createdAt: post?.createdAt
    }
  },

  async createPost(dto: CreateBlogInputModel): Promise<any> {
    const {title, shortDescription, content, blogId, createdAt} = dto

    const blog: any = await blogCollection.findOne({_id: new ObjectId(blogId)})

    if (!blog) {
      return undefined
    }

    const newBlog: any = {
      createdAt,
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog?.name,
    }
    const insertResult = await postCollection.insertOne(newBlog as any);

    return {
      id: insertResult.insertedId,
      title: newBlog?.title,
      shortDescription: newBlog?.shortDescription,
      content: newBlog?.content,
      blogId: newBlog?.blogId,
      blogName: blog?.name,
      createdAt: newBlog?.createdAt
    }
  },

  async updatePost(id: string, dto: UpdatePostInputModel): Promise<any> {
    const blog = await postCollection.updateOne({_id: new ObjectId(id)},
      {
        $set: {
          title: dto.title,
          content: dto.content,
          shortDescription: dto.shortDescription,
          blogId: dto.blogId
        }
      })

    return !(blog.matchedCount < 1)
  },

  async deletePostById(id: string): Promise<any> {
    const {deletedCount} = await postCollection.deleteOne({_id: new ObjectId(id)});
    return !!deletedCount
  },
};