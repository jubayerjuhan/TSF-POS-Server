import express from "express";
import { createUser } from "../controllers/userController.js";

// Create a new router object
const router = express.Router();

// Defineing all user routes here
router.route("/create").post(createUser);

// Export the router object so that it can be used in other modules
export default router;
