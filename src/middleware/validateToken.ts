import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
    userId: string;
    username: string;
    user: number;
}

interface CustomRequest extends Request {
    user?: JwtPayload;
}

// Type the middleware function as a RequestHandler
export const validateToken: RequestHandler = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (token == null) {
            res.status(400).json({
                message: 'Token not found',
                success: false,
                data: null
            });
            return;
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
            if (err) {
                res.status(403).json({
                    message: 'Invalid token',
                    success: false,
                    data: null
                });
            } else {
                req.user = user as JwtPayload;
                next(); // Proceed to the next middleware or route handler
            }
        });
    } else {
        res.status(400).json({
            message: 'Token not found',
            success: false,
            data: null
        });
    }
};
