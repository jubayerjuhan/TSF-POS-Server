import express from "express";

// import controller functions
import {
  completeSaleWithFullAmount,
  deleteSale,
  getPartialPayments,
  getSale,
  getSales,
  makeSale,
  salesAndPartialPayments,
} from "../controllers/saleController.js";

// verifying functions
import verifyAdminAndModerator from "../middlewares/verification/verifyAdminAndModerator.js";

// Create a new router instance
const router = express.Router();

// Defineing all sale routes here
router.route("/add").post(verifyAdminAndModerator, makeSale);

// get all sale list
router.route("/list").get(verifyAdminAndModerator, getSales);
router
  .route("/partial-payment/list")
  .get(verifyAdminAndModerator, getPartialPayments);

//all sales and partial payments for graph
router.route("/all/list").get(verifyAdminAndModerator, salesAndPartialPayments);

// action routes for single route
router
  .route("/action/:id")
  .get(verifyAdminAndModerator, getSale)
  .delete(verifyAdminAndModerator, deleteSale);

router
  .route("/complete/:id")
  .put(verifyAdminAndModerator, completeSaleWithFullAmount);

export default router;
