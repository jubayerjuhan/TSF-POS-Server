import express from "express";

// importing controller function
import {
  createBranch,
  deleteBranch,
  editBranch,
} from "../controllers/branch/branchController.js";
// branch - moderator - controller function
import {
  addModeratorsToBranch,
  deleteModeratorFromBranch,
} from "../controllers/branch/branchModeratorController.js";

// importing the verification function
import verifyAdmin from "../middlewares/verification/verifyAdmin.js";

// Create a new router instance
const router = express.Router();
/**
 * Defining All Routes Here
 */
// create branch
router.route("/create").post(verifyAdmin, createBranch);

// update and delete branch
router.route("/action/:branchId").put(verifyAdmin, editBranch);
router.route("/action/:branchId").delete(verifyAdmin, deleteBranch);

// moderator CRUD routes to the branch
router
  .route("/add-moderator/:branchId")
  .post(verifyAdmin, addModeratorsToBranch)
  .delete(verifyAdmin, deleteModeratorFromBranch);

// Export the router object so that it can be used in other modules
export default router;
