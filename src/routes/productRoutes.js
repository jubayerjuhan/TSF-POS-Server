import express from "express";

// importing controller function
import {
  createProduct,
  deleteProduct,
  editProduct,
  getProductList,
  searchProduct,
} from "../controllers/productController.js";

// importing the verification function
import verifyAdmin from "../middlewares/verification/verifyAdmin.js";
import { productUpload } from "../middlewares/multer/multerConfig.js";
import verifyAdminAndModerator from "../middlewares/verification/verifyAdminAndModerator.js";

// Create a new router instance
const router = express.Router();
/**
 * Defining All Routes Here
 */
// create product
router
  .route("/create")
  .post(verifyAdmin, productUpload.single("photo"), createProduct);

router.route("/list").get(verifyAdmin, getProductList);
// delete and update product
router
  .route("/action/:id")
  .delete(verifyAdmin, deleteProduct)
  .put(verifyAdmin, productUpload.single("photo"), editProduct);

// search product with product id
router.route("/search").get(verifyAdminAndModerator, searchProduct);
// Export the router object so that it can be used in other modules
export default router;
