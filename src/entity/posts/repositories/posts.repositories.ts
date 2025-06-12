import { CreateBlogInputModel } from "../dto/createPostsInputModel";
import { UpdatePostInputModel } from "../dto/updatePostsInputModel";
import { blogCollection, postCollection } from "../../../db/mongo.db";
import { ObjectId } from "mongodb";
import { Post } from "../types/post";
import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { PostResponse } from "../../blogs/types/postResponse";
import { SortDirection } from "../../../core/types/sortDesc";

export const postsRepository = {
  async findAllPosts(query: PagingAndSortType): Promise<PostResponse> {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = SortDirection.Desc
    } = query ?? {};

    const skip = (+pageNumber - 1) * +pageSize;
    const posts = await postCollection
      .find()
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .toArray();
    const totalCount = await postCollection.countDocuments();

    const items = posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt
    }));

    return {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items
    };
  },

  async findBlogById(id: string): Promise<Post> | null {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return null;
    }

    return {
      id: post?._id.toString(),
      title: post?.title,
      shortDescription: post?.shortDescription,
      content: post?.content,
      blogId: post?.blogId,
      blogName: post?.blogName,
      createdAt: post?.createdAt
    };
  },

  async createPost(dto: CreateBlogInputModel): Promise<Post> | null {
    const { title, shortDescription, content, blogId, createdAt } = dto;

    const blog = await blogCollection.findOne({
      _id: new ObjectId(blogId)
    });

    if (!blog) {
      return null;
    }

    const newPost = {
      createdAt,
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name
    };

    const insertResult = await postCollection.insertOne({
      _id: undefined,
      id: "",
      ...newPost
    });

    return {
      id: insertResult.insertedId,
      title: newPost?.title,
      shortDescription: newPost?.shortDescription,
      content: newPost?.content,
      blogId: newPost?.blogId,
      blogName: newPost?.blogName,
      createdAt: newPost?.createdAt
    };
  },

  async updatePost(id: string, dto: UpdatePostInputModel): Promise<boolean> {
    const blog = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: dto.title,
          content: dto.content,
          shortDescription: dto.shortDescription,
          blogId: dto.blogId
        }
      }
    );

    return !(blog.matchedCount < 1);
  },

  async deletePostById(id: string): Promise<boolean> {
    const { deletedCount } = await postCollection.deleteOne({
      _id: new ObjectId(id)
    });
    return !!deletedCount;
  },

  async createPostBlogId(
    id: any,
    dto: CreateBlogInputModel
  ): Promise<Post> | null {
    const { title, shortDescription, content, blogId, createdAt } = dto;

    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return null;
    }

    const newPost = {
      createdAt,
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name
    };

    const insertResult = await postCollection.insertOne({
      _id: undefined,
      id: "",
      ...newPost
    });

    return {
      id: insertResult.insertedId.toString(),
      title: newPost?.title,
      shortDescription: newPost?.shortDescription,
      content: newPost?.content,
      blogId: id,
      blogName: newPost?.blogName,
      createdAt: newPost?.createdAt
    };
  }
};
