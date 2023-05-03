import express from "express";

// import controller functions
import {
  deleteSale,
  getSale,
  getSales,
  makeSale,
} from "../controllers/saleController.js";

// verifying functions
import verifyAdminAndModerator from "../middlewares/verification/verifyAdminAndModerator.js";

// Create a new router instance
const router = express.Router();

// Defineing all sale routes here
router.route("/add").post(verifyAdminAndModerator, makeSale);
router.route("/list").get(verifyAdminAndModerator, getSales);
router
  .route("/action/:id")
  .get(verifyAdminAndModerator, getSale)
  .delete(verifyAdminAndModerator, deleteSale);

export default router;
