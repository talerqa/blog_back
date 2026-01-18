import { CreateBlogInputModel } from "../dto/createPostsInputModel";
import { UpdatePostInputModel } from "../dto/updatePostsInputModel";
import { postCollection } from "../../../db/mongo.db";
import { ObjectId } from "mongodb";
import { Post } from "../types/post";
import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { PostResponse } from "../../blogs/types/postResponse";
import { SortDirection } from "../../../core/types/sortDesc";
import { IMetaDataBlog } from "../../blogs/types/IMetaDataBlog";
import { SortFiledPost } from "../../../core/types/sortFiledBlogs";
import { mapperPaging } from "../../../core/utils/mapperPaging";
import { BlogDocument, BlogModel } from "../../blogs/domain/dto/blog.entity";
import { PostDocument, PostModel } from "../domain/dto/post.entity";
import { UserDocument, UserModel } from "../../user/domain/dto/user.entity";
import { User } from "../../user/types/user";

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

    const posts = await PostModel.find()
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .exec();

    const totalCount = await PostModel.countDocuments().exec();

    const metaData: IMetaDataBlog = {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount
    };

    return mapperPaging.mapToPostPaging(posts, metaData, userId);
  }

  async findPostById(id: string, userId: string): Promise<Post | null | any> {
    const post = (await PostModel.findById(id).exec()) as PostDocument;

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

    const postId = post._id;

    return {
      id: postId,
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

    const blog = await BlogModel.findById(blogId).exec();

    if (!blog) {
      return null;
    }

    const newPost: Post = {
      id: "",
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name as string,
      createdAt,
      extendedLikesInfo: {
        likesCount: [],
        dislikesCount: [],
        myStatus: "None",
        newestLikes: []
      }
    };

    const insertResult: PostDocument = new PostModel({
      // _id: undefined,
      ...newPost
    });
    await insertResult.save();

    return {
      id: insertResult._id,
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
        newestLikes: []
      }
    };
  }

  async updatePost(id: string, dto: UpdatePostInputModel): Promise<boolean> {
    const post = await PostModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title: dto.title,
          content: dto.content,
          shortDescription: dto.shortDescription,
          blogId: dto.blogId
        }
      },
      { new: true }
    );

    return post !== null;
  }

  async deletePostById(id: string): Promise<boolean> {
    const deletedPost = await PostModel.findByIdAndDelete(id);

    return deletedPost !== null;
  }

  async createPostBlogId(
    id: string,
    dto: CreateBlogInputModel
  ): Promise<Post | null | any> {
    const { title, shortDescription, content, blogId, createdAt } = dto;

    const blog = (await BlogModel.findById(id).exec()) as BlogDocument;

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

    const createdPost = await new PostModel({
      // _id: undefined,
      ...newPost
    });

    await createdPost.save();

    return {
      id: createdPost._id,
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
        newestLikes: []
      }
    };
  }

  async updateLikeComment(
    id: string,
    userId: string,
    likeStatus: string
  ): Promise<boolean | null> {
    const post = await PostModel.findById(id);
    if (!post) return null;

    const user = (await UserModel.findById(userId)) as User;

    const addedAt = new Date().toISOString();

    if (likeStatus === "Like") {
      await postCollection.updateOne({ _id: new ObjectId(id) }, [
        {
          $set: {
            "extendedLikesInfo.likesCount": {
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
