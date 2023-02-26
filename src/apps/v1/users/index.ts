import express from "express";

import { getUsers } from './users';
import login from "./login";
import register from "./register";

const router = express.Router();

router.route('/').get(getUsers);
router.route('/login/').post(login);
router.route('/register/').post(register)

export default router;