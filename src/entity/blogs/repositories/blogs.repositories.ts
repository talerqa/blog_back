import { Blog } from "../types/blog";
import { UpdateBlogInputModel } from "../dto/updateBlogsInputModel";
import { ObjectId } from "mongodb";
import { blogCollection, postCollection } from "../../../db/mongo.db";
import { CreateBlogInputModel } from "../dto/createBlogsInputModel";
import { BlogResponse } from "../types/blogResponse";
import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { PostResponse } from "../types/postResponse";
import { SortDirection } from "../../../core/types/sortDesc";
import { SortFiledBlogs } from "../../../core/types/sortFiledBlogs";
import { IMetaDataBlog } from "../types/IMetaDataBlog";
import { mapToBlogPaging } from "../../../core/utils/mappers/mapToBlogPaging";
import { mapToPostPaging } from "../../../core/utils/mappers/mapToPostPaging";
import { queryBlogRepo } from "./queryRepo";
import { mutationBlogRepo } from "./mutationRepo";

export const blogsRepository = {
  async findAllBlogs(query: PagingAndSortType): Promise<BlogResponse> {
    const {
      pageSize,
      pageNumber,
      sortDirection,
      sortBy,
      filter,
      skip
    } = await queryBlogRepo.getAllBlogs(query);

    const blogs = await blogCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogCollection.countDocuments(filter);

    const metaData: IMetaDataBlog = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount
    };

    return mapToBlogPaging(blogs, metaData);
  },

  async findBlogById(id: string): Promise<Blog | null> {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return null;
    }

    return queryBlogRepo.getBlogById(blog);
  },

  async createBlog(dto: CreateBlogInputModel): Promise<Blog | null> {
    const { name, description, createdAt, isMembership, websiteUrl } = dto;
    const insertResult = await blogCollection.insertOne({ ...dto } as Blog);

    const id = insertResult.insertedId.toString();

    const blog = mutationBlogRepo.createBlog({
      id,
      name,
      description,
      createdAt,
      isMembership,
      websiteUrl
    });

    return blog;
  },

  async updateBlog(id: string, dto: UpdateBlogInputModel): Promise<boolean> {
    const blog = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl
        }
      }
    );

    return !(blog.matchedCount < 1);
  },

  async deleteBlogById(id: string): Promise<boolean> {
    const { deletedCount } = await blogCollection.deleteOne({
      _id: new ObjectId(id)
    });
    return !!deletedCount;
  },

  async findPostsByBlogId(
    blogId: string,
    query: PagingAndSortType
  ): Promise<PostResponse | null> {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = SortFiledBlogs.CreatedAt,
      sortDirection = SortDirection.Desc
    } = query ?? {};

    const skip = (+pageNumber - 1) * +pageSize;

    const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) });

    if (!blog) {
      return null;
    }

    const postsById = await postCollection
      .find({ blogId })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .toArray();

    if (!postsById) {
      return null;
    }

    const totalCount = await postCollection.countDocuments({ blogId });

    const metaData: IMetaDataBlog = {
      pagesCount: Math.ceil(+totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount
    };

    return mapToPostPaging(postsById, metaData);
  }
};
