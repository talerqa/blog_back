import {Post} from "../types/post";
import {CreateBlogInputModel} from "../dto/createPostsInputModel";
import {UpdatePostInputModel} from "../dto/updatePostsInputModel";
import {blogCollection, postCollection} from "../../db/mongo.db";
import {WithId} from "mongodb";
import {Blog} from "../../blogs/types/blog";

export const postsRepository = {
  async findAllPosts(): Promise<any> {
    return postCollection.find().toArray();
  },

  async findBlogById(id: string): Promise<any> {
    return await postCollection.findOne({_id: new Object(id)}) ?? null;
  },

  async createBlog(dto: CreateBlogInputModel): Promise<any> {
    const {title, shortDescription, content, blogId, createdAt} = dto

    const blog: any = await blogCollection.findOne({_id: new Object(blogId)})

    if (!blog) {
      return undefined
    }

    const newBlog: any = {
      createdAt,
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name,
    }
    const insertResult = await blogCollection.insertOne(dto as any);
    return {...newBlog, _id: insertResult.insertedId}
  },

  async updatePost(id: string, dto: UpdatePostInputModel): Promise<any> {
    const blog = await postCollection.findOne({_id: new Object(id)}) ?? null;

    if (!blog) {
      return blog
    }

    blog.title = dto.title;
    blog.content = dto.content;
    blog.shortDescription = dto.shortDescription;
    blog.blogId = dto.blogId;
    return blog;
  },

  async deletePostById(id: string): Promise<any> {
    return postCollection.deleteOne({_id: new Object(id)});
  },
};