import express from "express";

// importing controller function
import {
  addModeratorsToBranch,
  createBranch,
} from "../controllers/branchController.js";

// importing the verification function
import verifyAdmin from "../middlewares/verification/verifyAdmin.js";

// Create a new router instance
const router = express.Router();

// Defineing all user routes here
router.route("/create").post(verifyAdmin, createBranch);
router
  .route("/add-moderator/:branchId")
  .post(verifyAdmin, addModeratorsToBranch);

// Export the router object so that it can be used in other modules
export default router;
