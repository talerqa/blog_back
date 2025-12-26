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
    postId: string,
    userId: string
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

    return mapperPaging.mapToCommentsPaging(posts, metaData, userId);
  }

  async findCommentById(id: string, userId: string): Promise<Comment | any> {
    const comment = await commentCollection.findOne({ _id: new ObjectId(id) });

    if (!comment) {
      return null;
    }
    const likesCount = comment.likesInfo?.likesCount?.length || 0;
    const dislikesCount = comment.likesInfo?.dislikesCount?.length || 0;

    // Проверяем статус пользователя
    const myStatus:
      | "Like"
      | "Dislike"
      | "None" = comment.likesInfo?.likesCount?.includes(userId)
      ? "Like"
      : comment.likesInfo?.dislikesCount?.includes(userId)
      ? "Dislike"
      : "None";

    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount,
        dislikesCount,
        myStatus: myStatus
      }
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
      createdAt,
      likesInfo: {
        likesCount: [],
        dislikesCount: [],
        myStatus: "None"
      }
    };

    const insertResult = await commentCollection.insertOne({
      ...newComment
    });

    return {
      id: insertResult.insertedId.toString(),
      content: newComment.content,
      commentatorInfo: newComment.commentatorInfo,
      createdAt: newComment.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None"
      }
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

  async updateLikeComment(
    id: string,
    userId: string,
    likeStatus: string
  ): Promise<boolean | null> {
    const comment = await commentCollection.findOne({ _id: new ObjectId(id) });

    if (!comment) {
      return null;
    }

    if (likeStatus === "Like") {
      await commentCollection.updateOne({ _id: new ObjectId(id) }, [
        {
          $set: {
            // "likesInfo.myStatus": likeStatus,
            // добавляем userId в лайки, если его еще нет
            "likesInfo.likesCount": {
              $setUnion: ["$likesInfo.likesCount", [userId]]
            },
            // удаляем userId из дизлайков
            "likesInfo.dislikesCount": {
              $setDifference: ["$likesInfo.dislikesCount", [userId]]
            }
          }
        }
      ]);
    }

    if (likeStatus === "Dislike") {
      await commentCollection.updateOne({ _id: new ObjectId(id) }, [
        {
          $set: {
            // "likesInfo.myStatus": likeStatus,
            // добавляем userId в дизлайки, если его еще нет
            "likesInfo.dislikesCount": {
              $setUnion: ["$likesInfo.dislikesCount", [userId]]
            },
            // удаляем userId из лайков
            "likesInfo.likesCount": {
              $setDifference: ["$likesInfo.likesCount", [userId]]
            }
          }
        }
      ]);
    }

    if (likeStatus === "None") {
      await commentCollection.updateOne({ _id: new ObjectId(id) }, [
        {
          $set: {
            // "likesInfo.myStatus": likeStatus,
            "likesInfo.likesCount": {
              $setDifference: ["$likesInfo.likesCount", [userId]]
            },
            "likesInfo.dislikesCount": {
              $setDifference: ["$likesInfo.dislikesCount", [userId]]
            }
          }
        }
      ]);
    }

    return true;
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
