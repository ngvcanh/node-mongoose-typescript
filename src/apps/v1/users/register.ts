import { Request, Response } from "express";
import { User, UserInterface } from "../../../models/user";

export default async function register(req: Request, res: Response) {
  try {
    const user: UserInterface = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}