import { Schema, model } from "mongoose";

const scoutSchema = new Schema({
  name: {
    type: String,
    required: false,
    trim: true,
  },
  password: {
    type: String,
    // required: true,
  },
  gender: {
    type: String,
    // required: true,
  },
  age: {
    type: String,
    // required: true,
  },
  education: {
    type: String,
    // required: true,
  },
  role: {
    type: String,
    // required: true,
  },
  company: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  bio: {
    type: String,
  },
  rate: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
});

const ScoutModel = model("Scout", scoutSchema);
export default ScoutModel;
