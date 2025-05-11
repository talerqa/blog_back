import {db, postDb} from "../../core/db/db";
import {Post} from "../types/post";
import {CreateBlogInputModel} from "../dto/createPostsInputModel";
import {UpdatePostInputModel} from "../dto/updatePostsInputModel";

export const postsRepository = {
  findAllPosts(): Post[] {
    return postDb.posts;
  },

  findBlogById(id: string): Post | null {
    return postDb.posts.find((d) => d.id === id) ?? null;
  },

  createBlog(dto: CreateBlogInputModel): Post | undefined {
    const {title, shortDescription, content, blogId} = dto
    const id = new Date().toISOString()

    const blog = db.blogs.find((b) => b.id === blogId)

    if (!blog) {
      return undefined
    }

    const newBlog: Post = {
      id,
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name,
    }

    postDb.posts.push(newBlog);
    return newBlog;
  },

  updatePost(id: string, dto: UpdatePostInputModel): Post | null {
    const blog = postDb.posts.find((d) => d.id === id) ?? null;

    if (!blog) {
      return blog
    }

    blog.title = dto.title;
    blog.content = dto.content;
    blog.shortDescription = dto.shortDescription;
    blog.blogId = dto.blogId;
    return blog;
  },

  deletePostById(id: string): number {
    const index = postDb.posts.findIndex((v) => v.id === id);
    postDb.posts.splice(index, 1);
    return index;
  },
};