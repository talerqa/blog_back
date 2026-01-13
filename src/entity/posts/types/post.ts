export type Post = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: string[];
    dislikesCount: string[];
    myStatus: myStatusLikesInfo;
    newestLikes: NewestLikesType[];
  };
};

export type NewestLikesType = {
  addedAt: string;
  userId: string;
  login: string;
};

export type myStatusLikesInfo = "None" | "Like" | "Dislike";

export type PostResponse = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: myStatusLikesInfo;
    newestLikes: NewestLikesType[];
  };
};
