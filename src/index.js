// Core Packages
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
// Database Connection Func
import connectDb from "./db/index.js";
// Error Handler and Catcher
import errorCatcherMiddleWare from "./middlewareS/error/errorCatcher.js";
import ErrorHandler from "./middlewares/error/errorHandler.js";
//Importing Routes Here
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";

// importing environment variables
import "dotenv/config";
import { productUpload } from "./middlewares/multer/multerConfig.js";
// import sendEmail from "./utils/email/email.js";
const app = express();

// connecting databse with app
connectDb();

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// getting uploaded image from images folder on server
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "images")));

// Define your routes
app.get("/", async (req, res, next) => {
  return next(new ErrorHandler(404, "Hello this is a error"));
});

// Routes
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/branch", branchRoutes);
app.use("/product", productRoutes);
app.use("/sale", saleRoutes);

// test router
app.post("/upload-photo", productUpload.single("photo"), (req, res, next) => {
  console.log(req.file);
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`);
});

// catch the error
app.use(errorCatcherMiddleWare);
