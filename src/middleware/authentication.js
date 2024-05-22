import jwt from "jsonwebtoken";
import User from "../components/auth/userModel.js";
import { jwtSecret } from "../../config/config.js";

const isAuthorized = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ message: "authentication invalid", success: false });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Token not authorized",
      });
    }

    const payload = jwt.verify(token, jwtSecret);

    const { userId } = payload;

    const user = await User.findById(userId);
    // Check if user account exists
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Token not authorized",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);

    res.status(401).json({
      success: false,
      msg: "Session Expired",
    });
  }
};

export default isAuthorized;
