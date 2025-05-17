import express from 'express';
import {setupApp} from './setup-app';
import {runDB} from "./db/mongo.db";

// создание приложения
export default async function bootstrap() {
  const app = express();
  setupApp(app);

// порт приложения
  const PORT = process.env.PORT || 5001;
  const uri = 'mongodb://localhost:27017';
  await runDB(uri);

// запуск приложения
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });

  return app;
};

bootstrap()