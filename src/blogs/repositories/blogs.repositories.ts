import {Blog} from "../types/blog";
import {db} from "../../core/db/db";
import {UpdateBlogInputModel} from "../dto/updateBlogsInputModel";
import {CreateBlogInputModel} from "../dto/createBlogsInputModel";

export const blogsRepository = {
  findAllBlogs(): Blog[] {
    return db.blogs;
  },

  findBlogById(id: string): Blog | null {
    return db.blogs.find((d) => d.id === id) ?? null;
  },

  createBlog(dto: CreateBlogInputModel): Blog {
    const {description, name, websiteUrl} = dto
    const id = new Date().toISOString()
    const newBlog: Blog = {
      id,
      description,
      name,
      websiteUrl
    }

    db.blogs.push(newBlog);
    return newBlog;
  },

  updateBlog(id: string, dto: UpdateBlogInputModel): void | null {
    const blog = db.blogs.find((d) => d.id === id) ?? null;

    if (!blog) {
      return blog
    }

    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    return;
  },

  deleteBlogById(id: string): void | null {
    const index = db.blogs.findIndex((v) => v.id === id);

    if (index === -1) {
      return null
    }

    db.blogs.splice(index, 1);
    return;
  },
};