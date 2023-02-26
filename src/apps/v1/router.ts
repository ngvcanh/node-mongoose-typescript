import express from "express";

import users from './users';

export default function getRouter(app: express.Express) {
  const router = express.Router();

  router.use('/users', users);

  app.use('/api/v1', router);
  return router;
}