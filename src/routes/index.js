import { Router } from "express";
import UserModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/utils.js";
import { Stripe_SK } from "../config/config.js";
import { Stripe } from "stripe";
import ScoutModel from "../model/scoutModel.js";
const stripe = Stripe(Stripe_SK);

const router = Router();

router.post("/auth/signup", async (req, res, next) => {
  try {
    const { email, password, name, education, job, gender, age } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res
        .status(401)
        .json({ message: "An account with this email already exist!" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = await new UserModel({
      name,
      email,
      password: hash,
      age,
      job,
      education,
      gender,
      createdAt: Date.now(),
    }).save();
    res
      .status(201)
      .json({ message: "Successfully created new user", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Account doesn't exit" });
    }

    const hash = user?.password;
    const isEqual = await bcrypt.compare(password, hash);
    if (!isEqual)
      return res
        .status(401)
        .json({ message: "password doesn't match, please try again!" });
    const token = await generateTokens(user?._id);
    const data = {
      accessToken: token,
      name: user?.name,
      email: user?.email,
      createdAt: user?.createdAt,
      userId: user?._id,
      accountType: user?.accountType,
    };
    return res
      .status(200)
      .json({ message: "user logged in successfully", data });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});

router.get("/create-payment-intent/:amount", async (req, res) => {
  try {
    // Create a PaymentIntent with the order amount and currency
    const amount = req.params.amount;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      message: "payment secret generated successfully",
      data: { clientSecret: paymentIntent.client_secret },
    });
    // res.send({
    //   clientSecret: paymentIntent.client_secret,
    // });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "server Error" });
  }
});

router.post("/admin/new", async (req, res, next) => {
  try {
    const { details } = req.body;
    const data = JSON.parse(details);
    const path = req.file?.path;
    const newPath = path?.replace("public\\", "");
    const scout = await new ScoutModel({
      name: `${data.firstName} ${data.lastName}`,
      company: data.company,
      role: data.role,
      imageUrl: newPath,
      createdAt: Date.now(),
      bio: data.bio,
      rate: data.rate,
    }).save();

    res
      .status(201)
      .json({ message: "Scout created successfully!", data: scout });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "server Error" });
  }
});

router.get("/admin/get-scouts", async (req, res, next) => {
  try {
    const scouts = await ScoutModel.find();
    res
      .status(200)
      .json({ message: "scouts retrieved successfully!", scouts: scouts });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "server Error" });
  }
});

router.get("/get-user-data/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Could not find user!" });
    }
    res
      .status(200)
      .json({ message: "User retrieved successfully!", user: user });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "server Error" });
  }
});

router.get("/get-scout-data/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const scout = await ScoutModel.findById(id);
    res
      .status(200)
      .json({ message: "scouts retrieved successfully!", scout: scout });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "server Error" });
  }
});

router.get("/admin/get-details", async (req, res, next) => {
  try {
    const Activescouts = await ScoutModel.find({ status: "Active" });
    const Inactive = await ScoutModel.find({ status: "Inactive" });
    res.status(200).json({
      message: "scouts retrieved successfully!",
      scouts: { active: Activescouts, inactive: Inactive },
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "server Error" });
  }
});

router.patch("/admin/deactivate-scout/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const scout = await ScoutModel.findById(id);
    scout.status = "Inactive";
    await scout.save();
    res.status(201).json({ message: "successfully deactivated scout" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "server Error" });
  }
});

router.patch("/admin/activate-scout/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const scout = await ScoutModel.findById(id);
    scout.status = "Active";
    await scout.save();
    res.status(201).json({ message: "successfully activated scout" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "server Error" });
  }
});

export default router;
