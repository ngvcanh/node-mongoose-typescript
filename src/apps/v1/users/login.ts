import { Request, Response } from "express";
import { User, UserInterface } from "../../../models/user";

export default async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user: UserInterface | null = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}