export type Comment = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: {
    likesCount: string[];
    dislikesCount: string[];
    myStatus: myStatusLikesInfo;
  };
};

export type myStatusLikesInfo = "None" | "Like" | "Dislike";
export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};
