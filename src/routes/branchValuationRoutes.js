import express from "express";
import {
  createBranchValuation,
  deleteBranchValuation,
  getBranchValuations,
} from "../controllers/branchValuationController.js";

// Create a new router instance
const router = express.Router();

router.route("/create").post(createBranchValuation);
router.route("/list").get(getBranchValuations);
router.route("/action/:id").delete(deleteBranchValuation);

export default router;
