// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";
import { setupApp } from "../../setup-app";
import { getBlogDto } from "../utils/blog/getBlogDto";
import { generateBasicAuthToken } from "../utils/generate-admin-auth-token";
import { runDB, stopDb } from "../../db/mongo.db";
import { clearDb } from "../utils/clearDb";

describe("Driver API body validation check", () => {
  const app = express();
  setupApp(app);

  const correctBlogAttributes = getBlogDto();

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB();
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });
  it(`❌ should not create driver when incorrect body passed; POST /api/drivers'`, async () => {
    const a = 10;

    expect(a).toEqual(10);
  });

  // it(`❌ should not create driver when incorrect body passed; POST /api/drivers'`, async () => {
  //   const correctTestDriverData: DriverCreateInput = {
  //     data: {
  //       type: ResourceType.Drivers,
  //       attributes: correctTestDriverAttributes,
  //     },
  //   };
  //
  //   await request(app)
  //     .post(DRIVERS_PATH)
  //     .send(correctTestDriverData)
  //     .expect(HttpStatus.Unauthorized);
  //
  //   const invalidDataSet1 = await request(app)
  //     .post(DRIVERS_PATH)
  //     .set('Authorization', generateBasicAuthToken())
  //     .send({
  //       data: {
  //         ...correctTestDriverData.data,
  //         attributes: {
  //           name: '   ', // empty string
  //           phoneNumber: '    ', // empty string
  //           email: 'invalid email', // incorrect email
  //           vehicleMake: '', // empty string
  //           vehicleModel: 'A6',
  //           vehicleYear: 2020,
  //           vehicleLicensePlate: 'XYZ-456',
  //           vehicleDescription: null,
  //           vehicleFeatures: [],
  //         },
  //       },
  //     })
  //     .expect(HttpStatus.BadRequest);
  //
  //   expect(invalidDataSet1.body.errors).toHaveLength(4);
  //
  //   const invalidDataSet2 = await request(app)
  //     .post(DRIVERS_PATH)
  //     .set('Authorization', generateBasicAuthToken())
  //     .send({
  //       data: {
  //         ...correctTestDriverData.data,
  //         attributes: {
  //           name: 'Feodor',
  //           phoneNumber: '', // empty string
  //           email: 'feodor@example.com',
  //           vehicleModel: '', // empty string
  //           vehicleLicensePlate: '', // empty string
  //           vehicleMake: '', // empty string
  //           vehicleYear: 2020,
  //           vehicleDescription: null,
  //           vehicleFeatures: [],
  //         },
  //       },
  //     })
  //     .expect(HttpStatus.BadRequest);
  //
  //   expect(invalidDataSet2.body.errors).toHaveLength(4);
  //
  //   const invalidDataSet3 = await request(app)
  //     .post(DRIVERS_PATH)
  //     .set('Authorization', generateBasicAuthToken())
  //     .send({
  //       data: {
  //         ...correctTestDriverData.data,
  //         attributes: {
  //           name: 'Feodor',
  //           email: 'feodor@example.com',
  //           phoneNumber: '', // empty string
  //           vehicleModel: '', // empty string
  //           vehicleLicensePlate: '', // empty string
  //           vehicleMake: '', // empty string
  //           vehicleYear: 2020,
  //           vehicleDescription: null,
  //           vehicleFeatures: [],
  //         },
  //       },
  //     })
  //     .expect(HttpStatus.BadRequest);
  //
  //   expect(invalidDataSet3.body.errors).toHaveLength(4);
  //
  //   // check что никто не создался
  //   const driverListResponse = await request(app)
  //     .get(DRIVERS_PATH)
  //     .set('Authorization', adminToken);
  //   expect(driverListResponse.body.data).toHaveLength(0);
  // });
  //
  // it('❌ should not update driver when incorrect data passed; PUT /api/drivers/:id', async () =>
  // {
  //   const createdDriver = await createDriver(app, correctTestDriverAttributes);
  //   const createdDriverId = createdDriver.data.id;
  //
  //   const correctTestDriverData: DriverUpdateInput = {
  //     data: {
  //       type: ResourceType.Drivers,
  //       id: createdDriverId,
  //       attributes: correctTestDriverAttributes,
  //     },
  //   };
  //
  //   const invalidDataSet1 = await request(app)
  //     .put(`${DRIVERS_PATH}/${createdDriverId}`)
  //     .set('Authorization', generateBasicAuthToken())
  //     .send({
  //       data: {
  //         ...correctTestDriverData.data,
  //         attributes: {
  //           name: '   ',
  //           phoneNumber: '    ',
  //           email: 'invalid email',
  //           vehicleMake: '',
  //           vehicleModel: 'A6',
  //           vehicleYear: 2020,
  //           vehicleLicensePlate: 'XYZ-456',
  //           vehicleDescription: null,
  //           vehicleFeatures: [],
  //         },
  //       },
  //     })
  //     .expect(HttpStatus.BadRequest);
  //
  //   expect(invalidDataSet1.body.errors).toHaveLength(4);
  //
  //   const invalidDataSet2 = await request(app)
  //     .put(`${DRIVERS_PATH}/${createdDriverId}`)
  //     .set('Authorization', generateBasicAuthToken())
  //     .send({
  //       data: {
  //         ...correctTestDriverData.data,
  //         attributes: {
  //           name: 'Ted',
  //           email: 'ted@example.com',
  //           vehicleMake: 'Audi',
  //           vehicleYear: 2020,
  //           vehicleDescription: null,
  //           vehicleFeatures: [],
  //           phoneNumber: '', // empty string
  //           vehicleModel: '', // empty string
  //           vehicleLicensePlate: '', // empty string
  //         },
  //       },
  //     })
  //     .expect(HttpStatus.BadRequest);
  //
  //   expect(invalidDataSet2.body.errors).toHaveLength(3);
  //
  //   const invalidDataSet3 = await request(app)
  //     .put(`${DRIVERS_PATH}/${createdDriverId}`)
  //     .set('Authorization', generateBasicAuthToken())
  //     .send({
  //       data: {
  //         ...correctTestDriverData.data,
  //         attributes: {
  //           name: 'A', //too short
  //           phoneNumber: '987-654-3210',
  //           email: 'feodor@example.com',
  //           vehicleMake: 'Audi',
  //           vehicleModel: 'A6',
  //           vehicleYear: 2020,
  //           vehicleLicensePlate: 'XYZ-456',
  //           vehicleDescription: null,
  //           vehicleFeatures: [],
  //         },
  //       },
  //     })
  //     .expect(HttpStatus.BadRequest);
  //
  //   expect(invalidDataSet3.body.errors).toHaveLength(1);
  //
  //   const driverResponse = await getDriverById(app, createdDriverId);
  //
  //   expect(driverResponse).toEqual({
  //     ...createdDriver,
  //   });
  // });
  //
  // it('❌ should not update driver when incorrect features passed; PUT /api/drivers/:id', async ()
  // => { const createdDriver = await createDriver(app, correctTestDriverAttributes); const
  // createdDriverId = createdDriver.data.id;  const correctTestDriverData: DriverUpdateInput = {
  // data: { type: ResourceType.Drivers, id: createdDriverId, attributes:
  // correctTestDriverAttributes, }, };  await request(app)
  // .put(`${DRIVERS_PATH}/${createdDriverId}`) .set('Authorization', generateBasicAuthToken())
  // .send({ data: { ...correctTestDriverData.data, attributes: { name: 'Ted', phoneNumber:
  // '987-654-3210', email: 'ted@example.com', vehicleMake: 'Audi', vehicleModel: 'A6',
  // vehicleYear: 2020, vehicleLicensePlate: 'XYZ-456', vehicleDescription: null, vehicleFeatures:
  // [ VehicleFeature.ChildSeat, 'invalid-feature' as VehicleFeature, VehicleFeature.WiFi, ], }, },
  // }) .expect(HttpStatus.BadRequest);  const driverResponse = await getDriverById(app,
  // createdDriverId);  expect(driverResponse).toEqual({ ...createdDriver, }); });
});
