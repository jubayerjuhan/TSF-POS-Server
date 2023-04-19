import express from "express";

// importing controller function
import {
  createProduct,
  deleteProduct,
  editProduct,
} from "../controllers/productController.js";

// importing the verification function
import verifyAdmin from "../middlewares/verification/verifyAdmin.js";
import { productUpload } from "../middlewares/multer/multerConfig.js";

// Create a new router instance
const router = express.Router();
/**
 * Defining All Routes Here
 */
// create product
router
  .route("/create")
  .post(verifyAdmin, productUpload.single("photo"), createProduct);

// delete and update product
router
  .route("/action/:id")
  .delete(verifyAdmin, deleteProduct)
  .put(verifyAdmin, productUpload.single("photo"), editProduct);
// Export the router object so that it can be used in other modules
export default router;
