import express from "express";
import { userLogin } from "../controllers/authController.js";

// Create a new router instance
const router = express.Router();

// Defineing all authentication routes here
router.route("/login").post(userLogin);

export default router;
