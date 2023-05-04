import express from "express";
import verifyAdminAndModerator from "../middlewares/verification/verifyAdminAndModerator.js";

// import controller functions
import {
  addExpense,
  deleteExpense,
  getExpense,
} from "../controllers/expenseController.js";

// Create a new router instance
const router = express.Router();

// Defineing all authentication routes here
router.route("/add").post(verifyAdminAndModerator, addExpense);
router
  .route("/action/:id")
  .get(verifyAdminAndModerator, getExpense)
  .delete(verifyAdminAndModerator, deleteExpense);

export default router;
