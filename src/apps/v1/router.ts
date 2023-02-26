import express from "express";

import users from './users';

export default function getRouter() {
  const router = express.Router();

  router.use('/users', users);

  return router;
}