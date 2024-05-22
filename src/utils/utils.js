import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config.js";

export const generateTokens = (userId) => {
  try {
    const payload = { userId: userId };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
    return token;
  } catch (error) {
    throw error;
  }
};
