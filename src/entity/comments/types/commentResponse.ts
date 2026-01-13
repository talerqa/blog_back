type Comment = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: myStatusLikesInfo;
  };
};

export type myStatusLikesInfo = "None" | "Like" | "Dislike";
export type CommentatorInfo = {
  userId: "string";
  userLogin: "string";
};

export type CommentResponse = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Comment[];
};
