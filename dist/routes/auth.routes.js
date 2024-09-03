import express from 'express';
import { login } from '../middleware/auth.middleware.js'; // Adjust path as needed
const router = express.Router();
// Route for login
router.post('/login', login);
export default router;
