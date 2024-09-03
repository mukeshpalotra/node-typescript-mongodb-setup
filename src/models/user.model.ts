import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
  fullName: string;
  mPin?: string;
  countryCode?: string;
  phoneNumber: string;
  phoneVerificationCode: string;
  email?: string;
  password?: string;
  gender?: string;
  bio?: string;
  profileImage?: string;
  status?: string;
  // setPassword(password: string): void;
  // validatePassword(password: string): boolean;
}

const UserSchema: Schema = new Schema<IUser>({
  fullName: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9\s]+$/, 'is invalid'],
    index: true
  },
  email: {
    type: String,
    lowercase: true,
    //required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],

  },
  phoneNumber: {
    type: String,
    required: [true, "can't be blank"],
    match: [/^\d{10,15}$/, 'is invalid'] // Ensures the phone number is between 10 and 15 digits
  },
  countryCode: {
    type: String,
    required: [true, "can't be blank"],
    match: [/^\+\d{1,4}$/, 'is invalid'] // Ensures the country code starts with '+' followed by 1 to 4 digits
  },
  phoneVerificationCode: String,
  gender: String,
  bio: String,
  profileImage: String,
  mPin: String,
  status: String

}, { timestamps: true });

// UserSchema.methods.setPassword = function(password: string): void {
//   this.salt = bcrypt.genSaltSync();
//   this.hash = bcrypt.hashSync(password, this.salt);
// };

// UserSchema.methods.validatePassword = function(password: string): boolean {
//   return bcrypt.compareSync(password, this.hash);
// };

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
