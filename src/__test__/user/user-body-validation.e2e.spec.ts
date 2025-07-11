import request from "supertest";
import express from "express";
import { setupApp } from "../../setup-app";
import { generateBasicAuthToken } from "../utils/generate-admin-auth-token";
import { runDB, stopDb } from "../../db/mongo.db";
import { clearDb } from "../utils/clearDb";
import { BLOGS_PATH, USER_PATH } from "../../core/paths/paths";
import { HttpStatus } from "../../core/types/httpCodes";
import { getUserDto } from "../utils/user/getUserDto";
import { User } from "../../entity/user/types/user";
import { findAllUserQueryRepo } from "../../entity/user/repositories/findAllUserQueryRepo";
import { SortFiledBlogs } from "../../core/types/sortFiledBlogs";
import { SortDirection } from "../../core/types/sortDesc";

describe("Driver API BLOG TEST", () => {
  const app = express();
  setupApp(app);

  const correctBlogAttributes = getUserDto();

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB();
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  const validUserData: any = {
    login: correctBlogAttributes.login,
    password: correctBlogAttributes.password,
    email: correctBlogAttributes.email
  };

  it(`should create user api/users'`, async () => {
    // @ts-ignore
    await request(app)
      .post(USER_PATH)
      .send(validUserData)
      .expect(HttpStatus.Unauthorized);
    // @ts-ignore
    await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send({
        data: {
          ...validUserData,
          password: "   ", // empty string
          login: "    ", // empty string
          email: "invalid email" // incorrect email
        }
      })
      .expect(HttpStatus.BadRequest);

    // @ts-ignore
    const response = await request(app)
      .post(USER_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send(validUserData)
      .expect(HttpStatus.Created);

    const createdUser: Omit<User, "password"> = response.body;
    expect(createdUser.login).toBe(validUserData.login);
    expect(createdUser.email).toBe(validUserData.email);
    expect(new Date(createdUser.createdAt).toString()).not.toBe("Invalid Date");

    const respAllBlogs = await findAllUserQueryRepo({
      pageNumber: 1,
      pageSize: 10,
      sortBy: SortFiledBlogs.CreatedAt,
      sortDirection: SortDirection.Desc
    });

    expect(respAllBlogs.items).toHaveLength(1);
  });

  it(`❌ should not create user  POST /api/users'`, async () => {
    // @ts-ignore
    const res = await request(app)
      .post(USER_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send({
        data: {
          ...validUserData,
          name: "   ", // empty string
          description: "    ", // empty string
          websiteUrl: "invalid email" // incorrect email
        }
      })
      .expect(HttpStatus.BadRequest);

    expect(res.body.errorsMessages).toHaveLength(3);
  });
  // it("❌ should not update blog when incorrect data ; PUT /blog/:id", async () => {
  //   const blogData = {
  //     name: correctBlogAttributes.name,
  //     description: correctBlogAttributes.description,
  //     websiteUrl: correctBlogAttributes.websiteUrl
  //   };
  //   // @ts-ignore
  //   const response = await request(app)
  //     .post(BLOGS_PATH)
  //     .set("Authorization", generateBasicAuthToken())
  //     .send(blogData)
  //     .expect(HttpStatus.Created);
  //
  //   const createdBlog = response.body;
  //
  //   const createdBlogId = createdBlog.id;
  //
  //   const correctTestDriverData: any = {
  //     data: {
  //       name: "update Name",
  //       description: "update Descr",
  //       websiteUrl: "https://samurai.com"
  //     }
  //   };
  //   // @ts-ignore
  //   const invalidDataSet1 = await request(app)
  //     .put(`${BLOGS_PATH}/${createdBlogId}`)
  //     .set("Authorization", generateBasicAuthToken())
  //     .send({
  //       data: {
  //         ...correctTestDriverData.data,
  //         name: " ",
  //         description: "",
  //         websiteUrl: "invalid websiteUrl"
  //       }
  //     })
  //     .expect(HttpStatus.BadRequest);
  //   expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);
  // });
  // it("update blog when correct data ; PUT /blog/:id", async () => {
  //   const blogData = {
  //     name: correctBlogAttributes.name,
  //     description: correctBlogAttributes.description,
  //     websiteUrl: correctBlogAttributes.websiteUrl
  //   };
  //   // @ts-ignore
  //   const response = await request(app)
  //     .post(BLOGS_PATH)
  //     .set("Authorization", generateBasicAuthToken())
  //     .send(blogData)
  //     .expect(HttpStatus.Created);
  //
  //   const createdBlogId = response?.body?.id;
  //   const correctTestDriverData = {
  //     name: "update Name",
  //     description: "update Descr",
  //     websiteUrl: "https://www.samurai.com"
  //   };
  //   // // @ts-ignore
  //   await request(app)
  //     .put(`${BLOGS_PATH}/${createdBlogId}`)
  //     .set("Authorization", generateBasicAuthToken())
  //     .send({
  //       ...correctTestDriverData
  //     })
  //     .expect(HttpStatus.NoContent);
  //
  //   // // @ts-ignore
  //   const respAllBlogs = await request(app)
  //     .get(`${BLOGS_PATH}/${createdBlogId}`)
  //     .set("Authorization", generateBasicAuthToken())
  //     .expect(HttpStatus.Ok);
  //
  //   expect(respAllBlogs?.body.name).toBe(correctTestDriverData.name);
  //   expect(respAllBlogs?.body.description).toBe(
  //     correctTestDriverData.description
  //   );
  //   expect(respAllBlogs?.body.websiteUrl).toBe(
  //     correctTestDriverData.websiteUrl
  //   );
  // });
  // it("delete blog when correct data ; DELETE /blog/:id", async () => {
  //   const blogData = {
  //     name: correctBlogAttributes.name,
  //     description: correctBlogAttributes.description,
  //     websiteUrl: correctBlogAttributes.websiteUrl
  //   };
  //   // @ts-ignore
  //   const response = await request(app)
  //     .post(BLOGS_PATH)
  //     .set("Authorization", generateBasicAuthToken())
  //     .send(blogData)
  //     .expect(HttpStatus.Created);
  //
  //   const createdBlogId = response?.body?.id;
  //   // @ts-ignore
  //   await request(app)
  //     .delete(`${BLOGS_PATH}/${createdBlogId}`)
  //     .set("Authorization", generateBasicAuthToken())
  //     .expect(HttpStatus.NoContent);
  //
  //   // @ts-ignore
  //   await request(app)
  //     .get(`${BLOGS_PATH}/${createdBlogId}`)
  //     .set("Authorization", generateBasicAuthToken())
  //     .expect(HttpStatus.NotFound);
  // });
  // it(`should create post by blogId  POST "/:blogId/posts'`, async () => {
  //   const blogData = {
  //     name: correctBlogAttributes.name,
  //     description: correctBlogAttributes.description,
  //     websiteUrl: correctBlogAttributes.websiteUrl
  //   };
  //   // @ts-ignore
  //   const response = await request(app)
  //     .post(BLOGS_PATH)
  //     .set("Authorization", generateBasicAuthToken())
  //     .send(blogData)
  //     .expect(HttpStatus.Created);
  //
  //   const blogId = response?.body?.id;
  //
  //   const dto = {
  //     title: "title",
  //     shortDescription: "shortDescription",
  //     content: "content"
  //   };
  //   // @ts-ignore
  //   const res = await request(app)
  //     .post(`${BLOGS_PATH}/${blogId}/posts`)
  //     .set("Authorization", generateBasicAuthToken())
  //     .send({
  //       id: blogId,
  //       ...dto
  //     })
  //     .expect(HttpStatus.Created);
  //
  //   expect(res.body.blogName).toBe(response?.body.name);
  // });
});
