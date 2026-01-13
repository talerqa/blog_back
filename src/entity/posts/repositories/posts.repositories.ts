import { CreateBlogInputModel } from "../dto/createPostsInputModel";
import { UpdatePostInputModel } from "../dto/updatePostsInputModel";
import {
  blogCollection,
  postCollection,
  userCollection
} from "../../../db/mongo.db";
import { ObjectId } from "mongodb";
import { NewestLikesType, Post } from "../types/post";
import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { PostResponse } from "../../blogs/types/postResponse";
import { SortDirection } from "../../../core/types/sortDesc";
import { IMetaDataBlog } from "../../blogs/types/IMetaDataBlog";
import { SortFiledPost } from "../../../core/types/sortFiledBlogs";
import { mapperPaging } from "../../../core/utils/mapperPaging";

export class PostsRepository {
  async findAllPosts(
    query: PagingAndSortType,
    userId: string
  ): Promise<PostResponse> {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = SortFiledPost.createdAt,
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

    const metaData: IMetaDataBlog = {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount
    };

    return mapperPaging.mapToPostPaging(posts, metaData, userId);
  }

  async findPostById(id: string, userId: string): Promise<Post | null | any> {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return null;
    }

    const likesCount = post.extendedLikesInfo?.likesCount?.length || 0;
    const dislikesCount = post.extendedLikesInfo?.dislikesCount?.length || 0;

    const lastTreeLikes = post.extendedLikesInfo?.likesCount
      ?.sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      ) // сортировка по дате
      .slice(0, 3); // берём последние 3 по времени

    // Проверяем статус пользователя
    const myStatus:
      | "Like"
      | "Dislike"
      | "None" = post.extendedLikesInfo?.likesCount?.some(
      like => like.userId === userId
    )
      ? "Like"
      : post.extendedLikesInfo?.dislikesCount?.some(
          dislike => dislike.userId === userId
        )
      ? "Dislike"
      : "None";

    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount,
        dislikesCount,
        myStatus: myStatus,
        newestLikes: lastTreeLikes
      }
    };
  }

  async createPost(dto: CreateBlogInputModel): Promise<Post | null | any> {
    const { title, shortDescription, content, blogId, createdAt } = dto;

    const blog = await blogCollection.findOne({
      _id: new ObjectId(blogId)
    });

    if (!blog) {
      return null;
    }

    const newPost: Post = {
      id: "",
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name,
      createdAt,
      extendedLikesInfo: {
        likesCount: [],
        dislikesCount: [],
        myStatus: "None",
        newestLikes: []
      }
    };

    const insertResult: any = await postCollection.insertOne({
      _id: undefined,
      ...newPost
    });

    return {
      id: insertResult.insertedId.toString(),
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
        newestLikes: [
          // {
          //   addedAt: new Date().toISOString(),
          //   userId: "",
          //   login: ""
          // }
        ]
      }
    };
  }

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
  }

  async deletePostById(id: string): Promise<boolean> {
    const { deletedCount } = await postCollection.deleteOne({
      _id: new ObjectId(id)
    });
    return !!deletedCount;
  }

  async createPostBlogId(
    id: string,
    dto: CreateBlogInputModel
  ): Promise<Post | null | any> {
    const { title, shortDescription, content, blogId, createdAt } = dto;

    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return null;
    }

    const newPost: Post = {
      id: "",
      createdAt,
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name,
      extendedLikesInfo: {
        likesCount: [],
        dislikesCount: [],
        myStatus: "None",
        newestLikes: []
      }
    };

    const insertResult = await postCollection.insertOne({
      _id: undefined,

      ...newPost
    });

    return {
      id: insertResult.insertedId.toString(),
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: id,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
        newestLikes: [
          // {
          //   addedAt: new Date().toISOString(),
          //   userId: "",
          //   login: ""
          // }
        ]
      }
    };
  }

  async updateLikeComment(
    id: string,
    userId: string,
    likeStatus: string
  ): Promise<boolean | null> {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });
    if (!post) return null;

    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    const addedAt = new Date().toISOString();

    if (likeStatus === "Like") {
      await postCollection.updateOne({ _id: new ObjectId(id) }, [
        {
          $set: {
            "extendedLikesInfo.likesCount": {
              // удаляем старый лайк этого user, чтобы не было дубликатов
              $setUnion: [
                {
                  $filter: {
                    input: "$extendedLikesInfo.likesCount",
                    as: "l",
                    cond: { $ne: ["$$l.userId", userId] }
                  }
                },
                [{ userId, addedAt, login: user?.login }]
              ]
            },
            "extendedLikesInfo.dislikesCount": {
              // удаляем дизлайк, если был
              $filter: {
                input: "$extendedLikesInfo.dislikesCount",
                as: "d",
                cond: { $ne: ["$$d.userId", userId] }
              }
            }
          }
        }
      ]);
    }

    if (likeStatus === "Dislike") {
      await postCollection.updateOne({ _id: new ObjectId(id) }, [
        {
          $set: {
            "extendedLikesInfo.dislikesCount": {
              $setUnion: [
                {
                  $filter: {
                    input: "$extendedLikesInfo.dislikesCount",
                    as: "d",
                    cond: { $ne: ["$$d.userId", userId] }
                  }
                },
                [{ userId, addedAt, login: user?.login }]
              ]
            },
            "extendedLikesInfo.likesCount": {
              $filter: {
                input: "$extendedLikesInfo.likesCount",
                as: "l",
                cond: { $ne: ["$$l.userId", userId] }
              }
            }
          }
        }
      ]);
    }

    if (likeStatus === "None") {
      await postCollection.updateOne({ _id: new ObjectId(id) }, [
        {
          $set: {
            "extendedLikesInfo.likesCount": {
              $filter: {
                input: "$extendedLikesInfo.likesCount",
                as: "l",
                cond: { $ne: ["$$l.userId", userId] }
              }
            },
            "extendedLikesInfo.dislikesCount": {
              $filter: {
                input: "$extendedLikesInfo.dislikesCount",
                as: "d",
                cond: { $ne: ["$$d.userId", userId] }
              }
            }
          }
        }
      ]);
    }

    return true;
  }
}
