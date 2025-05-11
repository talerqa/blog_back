import {Blog} from "../../blogs/types/blog";
import {Post} from "../../posts/types/post";

export const db = {
  blogs: <Blog[]>[
    {
      id: '123',
      name: "string",
      description: "string",
      websiteUrl: "false",
    }]
}

export const postDb = {
  posts: <Post[]>[
    {
      id: '123',
      title: '123',
      shortDescription: "123",
      content: "123",
      blogId: '123',
      blogName: '1213'
    }
  ]
}