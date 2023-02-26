import { Router } from 'express';
import { Database } from './database';
import { User, UserInterface } from './models/user';

export function configureRoutes(db: Database) {
  const router = Router();

  router.post('/register', async (req, res) => {
    try {
      const user: UserInterface = new User(req.body);
      await user.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/login', async (req, res) => {
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
  });

  return router;
}