var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { User } from '../models';
const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual secret
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find the user by email
        const user = yield User.findOne({ email });
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
        const token = jwt.sign({ id: user._id, fullname: user.fullName }, JWT_SECRET, { expiresIn: '1h' } // Token expires in 1 hour
        );
        // Send the token in the response
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
