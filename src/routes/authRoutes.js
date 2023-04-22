import express from "express";
import { forgotPassword, userLogin } from "../controllers/authController.js";

// Create a new router instance
const router = express.Router();

// Defineing all authentication routes here
router.route("/login").post(userLogin);
router.route("/forgot-password/:email").post(forgotPassword);

export default router;
