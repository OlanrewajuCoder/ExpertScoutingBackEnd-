import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  job: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
    enum: ["admin", "user", "scout"],
    default: "user",
  },
  imageUrl: {
    type: String,
  },
});

const UserModel = model("User", userSchema);
export default UserModel;
