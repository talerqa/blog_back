import { Comment } from "../types/comment";
import { CreateCommentInputModel } from "../dto/createCommentInputModel";
import { findUserQueryRepo } from "../../user/repositories/findUserQueryRepo";
import { commentCollection, postCollection } from "../../../db/mongo.db";
import { ObjectId } from "mongodb";
import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { CommentResponse } from "../types/commentResponse";
import { SortFiledComment } from "../../../core/types/sortFiledBlogs";
import { SortDirection } from "../../../core/types/sortDesc";
import { IMetaData } from "../../user/types/IMetaData";
import { mapToCommentsPaging } from "../../../core/utils/mappers/mapToCommentsPaging";
import { UpdateCommentInputModel } from "../dto/updateCommentInputModel";

export const commentRepository = {
  async findCommentsByPostId(
    query: PagingAndSortType,
    postId: string
  ): Promise<CommentResponse> | null {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = SortFiledComment.createdAt,
      sortDirection = SortDirection.Desc
    } = query ?? {};

    const post = await postCollection.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return null;
    }

    const skip = (+pageNumber - 1) * +pageSize;
    const posts = await commentCollection
      .find({ postId })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .toArray();
    const totalCount = await commentCollection.countDocuments({ postId });

    const metaData: IMetaData = {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount
    };

    return mapToCommentsPaging(posts, metaData);
  },

  async findCommentById(id: string): Promise<Comment> | null {
    const comment = await commentCollection.findOne({ _id: new ObjectId(id) });

    if (!comment) {
      return null;
    }

    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt
    };
  },

  async createComment(dto: CreateCommentInputModel): Promise<Comment | null> {
    const { postId, content, userId, createdAt } = dto;

    const user = await findUserQueryRepo(userId);
    const post = await postCollection.findOne({
      _id: new ObjectId(postId)
    });

    if (!post) {
      throw new Error("postDontExist");
    }

    const newComment = {
      commentatorInfo: {
        userId: userId,
        userLogin: user?.login
      },
      postId,
      content,
      createdAt
    };

    const insertResult = await commentCollection.insertOne({
      ...newComment
    });

    return {
      id: insertResult.insertedId.toString(),
      content: newComment.content,
      commentatorInfo: newComment.commentatorInfo,
      createdAt: newComment.createdAt
    };
  },

  async updateComment(
    id: string,
    userId: string,
    dto: UpdateCommentInputModel
  ): Promise<boolean> {
    const comment = await commentCollection.findOne({ _id: new ObjectId(id) });

    if (!comment) {
      return null;
    }

    if (comment?.commentatorInfo.userId !== userId) {
      throw new Error("notUserComment");
    }

    const commentUpdate = await commentCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content: dto.content
        }
      }
    );

    return !(commentUpdate.matchedCount < 1);
  },
  //
  async deleteCommentById(id: string, userId: string): Promise<boolean> {
    const comment = await commentCollection.findOne({ _id: new ObjectId(id) });

    if (!comment) {
      return null;
    }

    if (comment?.commentatorInfo.userId !== userId) {
      throw new Error("notUserComment");
    }

    const { deletedCount } = await commentCollection.deleteOne({
      _id: new ObjectId(id)
    });
    return !!deletedCount;
  }
  //
  // async createPostBlogId(
  //   id: string,
  //   dto: CreateBlogInputModel
  // ): Promise<Comment | null> {
  //   const { title, shortDescription, content, blogId, createdAt } = dto;
  //
  //   const blog = await blogCollection.findOne({ _id: new ObjectId(id) });
  //
  //   if (!blog) {
  //     return null;
  //   }
  //
  //   const newPost = {
  //     createdAt,
  //     title,
  //     shortDescription,
  //     content,
  //     blogId,
  //     blogName: blog.name
  //   };
  //
  //   const insertResult = await postCollection.insertOne({
  //     _id: undefined,
  //     id: "",
  //     ...newPost
  //   });
  //
  //   return {
  //     id: insertResult.insertedId.toString(),
  //     title: newPost.title,
  //     shortDescription: newPost.shortDescription,
  //     content: newPost.content,
  //     blogId: id,
  //     blogName: newPost.blogName,
  //     createdAt: newPost.createdAt
  //   };
  // }
};
