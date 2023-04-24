import express from "express";

// import controller functions
import { makeSale } from "../controllers/saleController.js";

// verifying functions
import verifyAdminAndModerator from "../middlewares/verification/verifyAdminAndModerator.js";

// Create a new router instance
const router = express.Router();

// Defineing all sale routes here
router.route("/add").post(verifyAdminAndModerator, makeSale);

export default router;
