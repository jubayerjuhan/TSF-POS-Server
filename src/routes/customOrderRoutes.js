import express from "express";
import {
  createCustomOrder,
  deleteCustomOrder,
  editCustomOrder,
  getAllCustomOrders,
  getCustomOrderAmount,
  getCustomOrderById,
  updateCustomOrderStatus,
} from "../controllers/customOrderController.js";
import { multerUpload } from "../middlewares/multer/multerConfig.js";

// Create a new router instance
const router = express.Router();

router.route("/create").post(multerUpload.array("photos"), createCustomOrder);
router.route("/list").get(getAllCustomOrders);
router.route("/amount").get(getCustomOrderAmount);
router.route("/action/:id").get(getCustomOrderById);
router.route("/action/:id").delete(deleteCustomOrder);
router.route("/action/:id").put(updateCustomOrderStatus);
router.route("/edit/:id").put(editCustomOrder);

export default router;
