import express from 'express';
import {setupApp} from './setup-app';
import {runDB} from "./db/mongo.db";
import * as dotenv from 'dotenv'

dotenv.config()

// создание приложения
export  default async function bootstrap() {
  const app = express();
  setupApp(app);

// порт приложения
  const PORT = process.env.PORT || 5001;

  await runDB(process.env.MONGODB_URI ?? '');

// запуск приложения
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();