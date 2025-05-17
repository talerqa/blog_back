import express from 'express';
import {setupApp} from './setup-app';
import {runDB} from "./db/mongo.db";

// создание приложения
const bootstrap = async () => {
  const app = express();
  setupApp(app);

// порт приложения
  const PORT = process.env.PORT || 5001;
  await runDB('mongodb://localhost:27017');

// запуск приложения
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
  return app;
};

bootstrap();