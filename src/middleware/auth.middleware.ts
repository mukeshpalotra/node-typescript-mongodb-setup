import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual secret

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Validate password
    // if (!user.validatePassword(password)) {
    //   res.status(401).json({ message: 'Invalid password' });
    //   return;
    // }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, fullname: user.fullName },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send the token in the response
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
