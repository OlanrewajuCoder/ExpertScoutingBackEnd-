import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./src/routes/index.js";
import { DB_URI, PORT } from "./src/config/config.js";
import multer from "multer";
import path from "path";

const app = express();

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(bodyParser.json({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("file")
);
app.use(express.static("public"));
app.use(routes);

// app.use("/images", express.static(path.join(__dirname, "images")));

mongoose
  .connect(DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Connected at localhost ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err, "error");
  });
