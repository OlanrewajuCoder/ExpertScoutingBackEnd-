import dotenv from "dotenv";

dotenv.config();

export const DB_URI = process.env.MONGODB_URI || "";
export const PORT = 8000;
export const jwtSecret = process.env.JWT_SECRET;
export const Stripe_SK = process.env.STRIPE_SK;
