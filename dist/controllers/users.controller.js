var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from '../models/index.js';
import { generateSixDigitRandomNumber, generateRefreshToken } from '../helpers/helper.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
class ParentController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullName, countryCode, phoneNumber } = req.body;
                if (!fullName || ![phoneNumber, countryCode].every(Boolean)) {
                    return res.status(200).send({
                        message: locals.enter_all_filed,
                        success: false,
                        data: null
                    });
                }
                let phoneVerificationCode = generateSixDigitRandomNumber();
                const user = new User({ fullName, countryCode, phoneNumber, phoneVerificationCode });
                // user.setPassword(password);
                if (yield user.save()) {
                    return res.status(200).send({ message: locals.otp_send, success: true, data: phoneVerificationCode });
                }
                else {
                    return res.status(200).send({ message: locals.something_went_wrong, success: false, data: null
                    });
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    //return res.status(500).send({ error: 'Error fetching user', details: error.message });
                    return res.status(200).send({ message: error.message, success: false, data: null
                    });
                }
                else {
                    return res.status(500).send({ error: 'Error creating user', details: 'Unknown error occurred' });
                }
            }
        });
    }
    sendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phoneNumber, countryCode } = req.body;
                if (![phoneNumber, countryCode].every(Boolean)) {
                    return res.status(200).send({
                        message: locals.enter_all_filed,
                        success: false,
                        data: null
                    });
                }
                const userDetails = yield User.findOne({ phoneNumber, countryCode });
                if (userDetails) {
                    const generatedCode = generateSixDigitRandomNumber(); // Renamed to avoid conflict
                    const updateOtp = yield User.updateOne({ phoneNumber, countryCode }, { $set: { phoneVerificationCode: generatedCode } });
                    if (updateOtp) {
                        return res.status(200).send({ message: locals.otp_send, success: true, data: generatedCode });
                    }
                    else {
                        return res.status(200).send({ message: locals.something_went_wrong, success: false, data: null });
                    }
                }
                else {
                    return res.status(200).send({
                        message: locals.phone_number_not_exist,
                        success: false,
                        data: null
                    });
                }
            }
            catch (err) {
                return res.status(200).send({
                    message: locals.something_went_wrong,
                    success: false,
                    data: null
                });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phoneNumber, countryCode, phoneVerificationCode } = req.body;
                if (![phoneNumber, countryCode, phoneVerificationCode].every(Boolean)) {
                    return res.status(200).send({
                        message: locals.enter_all_filed,
                        success: false,
                        data: null
                    });
                }
                const userDetails = yield User.findOne({ phoneNumber: phoneNumber, countryCode: countryCode });
                if (userDetails) {
                    if (phoneVerificationCode == userDetails.phoneVerificationCode) {
                        yield User.updateOne({ phoneNumber: phoneNumber, countryCode: countryCode }, // Query to match the document you want to update
                        {
                            $set: {
                                phoneVerificationCode: "",
                                status: "active"
                            }
                        });
                        const accessToken = generateAccessToken({ user: userDetails === null || userDetails === void 0 ? void 0 : userDetails._id });
                        const refreshToken = generateRefreshToken({ user: userDetails === null || userDetails === void 0 ? void 0 : userDetails._id });
                        return res.status(200).send({
                            message: locals.login_success,
                            success: true,
                            data: userDetails,
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                        });
                    }
                    else {
                        return res.status(200).send({ message: locals.otp_not_match, success: false, data: null });
                    }
                }
                else {
                    return res.status(200).send({
                        message: locals.phone_number_not_exist,
                        success: false,
                        data: null
                    });
                }
            }
            catch (err) {
                return res.status(200).send({
                    message: locals.something_went_wrong,
                    success: false,
                    data: null
                });
            }
        });
    }
    setMpin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mPin } = req.body;
                if (!mPin) {
                    return res.status(200).send({
                        message: locals.enter_all_filed,
                        success: false,
                        data: null
                    });
                }
                const user_id = req.user.user;
                let userDetails = yield User.updateOne({ _id: user_id }, // Query to match the document you want to update
                {
                    $set: {
                        mPin: yield hashPassword(mPin)
                    }
                });
                if (userDetails) {
                    return res.status(200).send({ message: locals.mpin_set_message, success: true, data: null });
                }
                else {
                    return res.status(200).send({ message: locals.phone_number_not_exist, success: false, data: null });
                }
            }
            catch (err) {
                return res.status(200).send({
                    message: locals.something_went_wrong,
                    success: false,
                    data: null
                });
            }
        });
    }
}
// accessTokens
let accessTokens = [];
function generateAccessToken(user) {
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || '', {
        expiresIn: process.env.JWT_EXPIRE,
    });
    accessTokens.push(accessToken);
    return accessToken;
}
const saltRounds = 10;
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt.genSalt(saltRounds);
        return bcrypt.hash(password, salt);
    });
}
function comparePassword(password, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt.compare(password, hash);
    });
}
export default new ParentController();
// Create a new user
// export const createUser = async (req: Request, res: Response) => {
// };
// // Get a user by ID
// const getUser = async (req: Request, res: Response) => {
//   try {
//     return res.status(404).json('User  found');
//     const user = await User.findById(req.params.id).select('-hash -salt'); // Exclude sensitive fields
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ error: 'Error fetching user', details: error.message });
//     } else {
//       res.status(500).json({ error: 'Error fetching user', details: 'Unknown error occurred' });
//     }
//   }
// };
// // Update a user by ID
// export const updateUser = async (req: Request, res: Response) => {
//   try {
//     const updates = req.body;
//     if (updates.password) {
//       const user = await User.findById(req.params.id);
//       if (user) {
//         user.setPassword(updates.password);
//         updates.hash = user.hash;
//         updates.salt = user.salt;
//       }
//     }
//     const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-hash -salt');
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.status(200).json({ message: 'User updated successfully', user });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ error: 'Error updating user', details: error.message });
//     } else {
//       res.status(500).json({ error: 'Error updating user', details: 'Unknown error occurred' });
//     }
//   }
// };
// // Delete a user by ID
// export const deleteUser = async (req: Request, res: Response) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ error: 'Error deleting user', details: error.message });
//     } else {
//       res.status(500).json({ error: 'Error deleting user', details: 'Unknown error occurred' });
//     }
//   }
// };
// export default {
//   createUser,
//   getUser,
//   updateUser,
//   deleteUser,
// };
