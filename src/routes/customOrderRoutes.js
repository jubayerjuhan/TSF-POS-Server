import express from "express";
import {
  createCustomOrder,
  getCustomOrderById,
} from "../controllers/customOrderController.js";

// Create a new router instance
const router = express.Router();

router.route("/create").post(createCustomOrder);
router.route("/action/:id").get(getCustomOrderById);

export default router;
