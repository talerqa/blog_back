import { Blog } from "../../../entity/blogs/types/blog";

export function getBlogDto(): Blog {
  return {
    id: "string",
    name: "Blog Test",
    description: "Description Test",
    websiteUrl: "https://www.youtube.com/",
    createdAt: "2025-06-18T20:36:26.127Z",
    isMembership: false
  };
}
