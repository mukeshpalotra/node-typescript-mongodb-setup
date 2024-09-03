import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
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
const User = mongoose.model('User', UserSchema);
export default User;
