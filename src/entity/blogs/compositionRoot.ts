import { BlogsRepository } from "./repositories/mutationBlogs.repositories";
import { BlogsService } from "./application/blogs.service";
import { postsRepository } from "../posts/compositionRoot";
import { MutationBlogRepo } from "./repositories/utils/mutationRepo";

export const mutationBlogRepo = new MutationBlogRepo();
export const blogsRepository = new BlogsRepository(mutationBlogRepo);
export const blogsService = new BlogsService(blogsRepository, postsRepository);
