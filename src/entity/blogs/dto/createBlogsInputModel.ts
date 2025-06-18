export type CreateBlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
  title?: string;
  shortDescription?: string;
  content?: string;
};
