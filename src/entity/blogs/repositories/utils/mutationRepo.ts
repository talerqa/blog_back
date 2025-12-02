import { Blog } from "../../types/blog";

export class MutationBlogRepo {
  async createBlog(body: {
    createdAt: string;
    websiteUrl: string;
    name: string;
    isMembership: boolean;
    description: string;
    id: string;
  }): Promise<Blog> {
    const { id, name, description, createdAt, isMembership, websiteUrl } = body;

    return {
      id,
      name,
      description,
      websiteUrl,
      createdAt,
      isMembership: isMembership ?? false
    };
  }
}
