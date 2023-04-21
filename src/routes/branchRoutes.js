import express from "express";

// importing controller function
import {
  createBranch,
  deleteBranch,
  editBranch,
  getBranchInformation,
} from "../controllers/branch/branchController.js";
// branch - moderator - controller function
import {
  addModeratorsToBranch,
  deleteModeratorFromBranch,
} from "../controllers/branch/branchModeratorController.js";

// branch - product - controller function
import {
  addProductToBranch,
  changeProductQuantity,
  deleteProductFromBranch,
  moveProductBetweenBranches,
} from "../controllers/branch/branchProductController.js";

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
router
  .route("/action/:branchId")
  .get(verifyAdmin, getBranchInformation)
  .put(verifyAdmin, editBranch)
  .delete(verifyAdmin, deleteBranch);

// moderator add or delete routes to the branch
router
  .route("/moderator/:branchId")
  .post(verifyAdmin, addModeratorsToBranch)
  .delete(verifyAdmin, deleteModeratorFromBranch);

// product add or delete routes to the branch
router
  .route("/product/:branchId")
  .post(verifyAdmin, addProductToBranch)
  .delete(verifyAdmin, deleteProductFromBranch)
  .put(verifyAdmin, changeProductQuantity);

// move product between branches
router
  .route("/move-product/:productId")
  .post(verifyAdmin, moveProductBetweenBranches);
// Export the router object so that it can be used in other modules
export default router;
