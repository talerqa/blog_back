import { Comment } from "../types/comment";
import { CreateCommentInputModel } from "../dto/createCommentInputModel";
import { findUserByIdQueryRepo } from "../../user/repositories/findUserByIdQueryRepo";
import { commentCollection, postCollection } from "../../../db/mongo.db";
import { ObjectId } from "mongodb";
import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { SortFiledComment } from "../../../core/types/sortFiledBlogs";
import { SortDirection } from "../../../core/types/sortDesc";
import { IMetaData } from "../../user/types/IMetaData";
import { UpdateCommentInputModel } from "../dto/updateCommentInputModel";
import { mapperPaging } from "../../../core/utils/mapperPaging";

export class CommentRepository {
  async findCommentsByPostId(
    query: PagingAndSortType,
    postId: string
  ): Promise<any> {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = SortFiledComment.createdAt,
      sortDirection = SortDirection.Desc
    } = query ?? {};

    const post = await postCollection.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      throw new Error();
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

    return mapperPaging.mapToCommentsPaging(posts, metaData);
  }

  async findCommentById(id: string): Promise<Comment | any> {
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
  }

  async createComment(
    dto: CreateCommentInputModel
  ): Promise<Comment | null | any> {
    const { postId, content, userId, createdAt } = dto;

    const user = await findUserByIdQueryRepo(userId);
    const post = await postCollection.findOne({
      _id: new ObjectId(postId)
    });

    if (!post) {
      throw new Error("postDontExist");
    }

    const newComment: any = {
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
  }

  async updateComment(
    id: string,
    userId: string,
    dto: UpdateCommentInputModel
  ): Promise<boolean | null> {
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
  }

  async deleteCommentById(id: string, userId: string): Promise<boolean | null> {
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
}
