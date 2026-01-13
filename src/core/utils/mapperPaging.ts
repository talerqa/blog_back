import { WithId } from "mongodb";
import { Blog } from "../../entity/blogs/types/blog";
import { IMetaDataBlog } from "../../entity/blogs/types/IMetaDataBlog";
import { BlogResponse } from "../../entity/blogs/types/blogResponse";
import { Comment } from "../../entity/comments/types/comment";
import { IMetaData } from "../../entity/user/types/IMetaData";
import { CommentResponse } from "../../entity/comments/types/commentResponse";
import { Post } from "../../entity/posts/types/post";
import { PostResponse } from "../../entity/blogs/types/postResponse";
import { Security } from "../../entity/security/types/security";
import { SecurityResponse } from "../../entity/security/types/securityResponse";
import { User } from "../../entity/user/types/user";
import { UserResponse } from "../../entity/user/types/userResponse";

export class MapperPaging {
  mapToBlogPaging(
    blogs: WithId<Blog>[],
    metaData: IMetaDataBlog
  ): BlogResponse {
    const items = blogs.map((blog: WithId<Blog>) => {
      return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership ?? false
      };
    });
    return {
      items,
      page: metaData.page,
      pagesCount: metaData.pagesCount,
      pageSize: metaData.pageSize,
      totalCount: metaData.totalCount
    };
  }

  mapToCommentsPaging = (
    post: WithId<Comment>[],
    metaData: IMetaData,
    userId: string
  ): CommentResponse => {
    const items = post.map((post: WithId<Comment>) => {
      const likesCount = post.likesInfo?.likesCount?.length || 0;
      const dislikesCount = post.likesInfo?.dislikesCount?.length || 0;

      // Проверяем статус пользователя
      const myStatus:
        | "Like"
        | "Dislike"
        | "None" = post.likesInfo?.likesCount?.includes(userId)
        ? "Like"
        : post.likesInfo?.dislikesCount?.includes(userId)
        ? "Dislike"
        : "None";

      return {
        id: post._id.toString(),
        content: post.content,
        commentatorInfo: post.commentatorInfo,
        createdAt: post.createdAt,
        likesInfo: {
          likesCount,
          dislikesCount,
          myStatus: myStatus
        }
      };
    });

    return {
      items,
      ...metaData
    };
  };

  mapToPostPaging(
    post: WithId<Post>[],
    metaData: IMetaDataBlog,
    userId: string
  ): PostResponse {
    const items = post.map((post: WithId<Post>) => {
      const likesCount = post.extendedLikesInfo?.likesCount?.length || 0;
      const dislikesCount = post.extendedLikesInfo?.dislikesCount?.length || 0;

      const lastTreeLikes = post.extendedLikesInfo?.likesCount
        ?.sort(
          (a, b) =>
            new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        ) // сортировка
        // по дате
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
    });

    return {
      items,
      ...metaData
    };
  }

  mapToSecurityPaging(sessions: Security[]): SecurityResponse[] {
    return sessions.map(session => {
      return {
        ip: session.ip,
        title: session.title,
        lastActiveDate: session.lastActiveDate,
        deviceId: session.deviceId
      };
    });
  }

  mapToUserPaging(
    users: WithId<Omit<User, "password">>[],
    metaData: IMetaDataBlog
  ): UserResponse {
    const items = users.map(blog => {
      return {
        id: blog._id.toString(),
        login: blog.login,
        email: blog.email,
        createdAt: blog.createdAt,
        emailConfirmation: blog.emailConfirmation
      };
    });

    return {
      items,
      page: metaData.page,
      pagesCount: metaData.pagesCount,
      pageSize: metaData.pageSize,
      totalCount: metaData.totalCount
    };
  }
}

export const mapperPaging = new MapperPaging();
