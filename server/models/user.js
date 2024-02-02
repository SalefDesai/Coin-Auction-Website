import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    userProfileImage : String,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    userType: {
      type: String,
      enum: ['seller', 'user'],
      default: 'user',
    },
  });


const User = mongoose.model("user",userSchema);

export default User;
