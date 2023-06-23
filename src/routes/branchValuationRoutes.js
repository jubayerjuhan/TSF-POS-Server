import express from "express";
import {
  createBranchValuation,
  deleteBranchValuation,
  getBranchValuations,
} from "../controllers/branchValuationController";

// Create a new router instance
const router = express.Router();

router.route("/create").post(createBranchValuation);
router.route("/list").post(getBranchValuations);
router.route("/action/:id").post(deleteBranchValuation);

export default router;
