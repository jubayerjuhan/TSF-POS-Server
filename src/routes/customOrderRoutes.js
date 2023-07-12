import express from "express";
import {
  createCustomOrder,
  deleteCustomOrder,
  getAllCustomOrders,
  getCustomOrderAmount,
  getCustomOrderById,
  updateCustomOrderStatus,
} from "../controllers/customOrderController.js";

// Create a new router instance
const router = express.Router();

router.route("/create").post(createCustomOrder);
router.route("/list").get(getAllCustomOrders);
router.route("/amount").get(getCustomOrderAmount);
router.route("/action/:id").get(getCustomOrderById);
router.route("/action/:id").delete(deleteCustomOrder);
router.route("/action/:id").put(updateCustomOrderStatus);

export default router;
