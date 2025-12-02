import { PostsRepository } from "./repositories/posts.repositories";
import { PostsService } from "./services/posts.service";

export const postsRepository = new PostsRepository();
export const postsService = new PostsService(postsRepository);
