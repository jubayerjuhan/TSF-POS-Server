import express from "express";
import verifyAdminAndModerator from "../middlewares/verification/verifyAdminAndModerator.js";

// import controller functions
import { addExpense } from "../controllers/expenseController.js";

// Create a new router instance
const router = express.Router();

// Defineing all authentication routes here
router.route("/add").post(verifyAdminAndModerator, addExpense);

export default router;
