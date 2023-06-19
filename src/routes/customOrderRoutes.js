import express from "express";
import {
  createCustomOrder,
  deleteCustomOrder,
  getCustomOrderById,
  updateCustomOrderStatus,
} from "../controllers/customOrderController.js";

// Create a new router instance
const router = express.Router();

router.route("/create").post(createCustomOrder);
router.route("/action/:id").get(getCustomOrderById);
router.route("/action/:id").delete(deleteCustomOrder);
router.route("/action/:id").put(updateCustomOrderStatus);

export default router;
