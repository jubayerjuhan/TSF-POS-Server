// Core Packages
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
// Database Connection Func
import connectDb from "./db/index.js";
// Error Handler and Catcher
import errorCatcherMiddleWare from "./middlewares/error/errorCatcher.js";
import ErrorHandler from "./middlewares/error/errorHandler.js";
//Importing Routes Here
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import customOrderRoutes from "./routes/customOrderRoutes.js";
import branchValuationRoutes from "./routes/branchValuationRoutes.js";

// importing environment variables
import "dotenv/config";
import multer from "multer";
import moment from "moment";
// import sendEmail from "./utils/email/email.js";
const app = express();

// connecting databse with app
connectDb();

// using cors
app.use(cors());
// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// getting uploaded image from images folder on server
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "images")));

// Define your routes
app.get("/", async (req, res, next) => {
  res.send("Hello...!")
});

console.log("Now Date :");
console.log(moment().tz("Asia/Dhaka").format("DD-MM-YYYY hh:mm a"));
// Routes
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/branch", branchRoutes);
app.use("/branch-valuation", branchValuationRoutes);
app.use("/product", productRoutes);
app.use("/sale", saleRoutes);
app.use("/custom-order", customOrderRoutes);
app.use("/expense", expenseRoutes);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}...!`);
});

// catch the error
app.use(errorCatcherMiddleWare);
