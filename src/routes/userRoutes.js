import express from "express";

// importing controller function
import { createUser } from "../controllers/userController.js";

// importing the verification function
import verifyAdmin from "../middlewares/verification/verifyAdmin.js";

// Create a new router object
const router = express.Router();

// Defineing all user routes here
router.route("/create").post(verifyAdmin, createUser);

// Export the router object so that it can be used in other modules
export default router;
