import express from "express";

// importing controller function
import { createProduct } from "../controllers/productController.js";

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

// Export the router object so that it can be used in other modules
export default router;
