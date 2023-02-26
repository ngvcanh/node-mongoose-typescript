import { Request, Response } from "express";
import { User } from "../../../models/user";

export async function getUsers(req: Request, res: Response) {
  const list = await User.find();
  res.json(list.map(user => user.toObject()));
}