import express from "express";

// importing controller function
import {
  createUser,
  deleteUser,
  getUsersList,
} from "../controllers/userController.js";

// importing the verification function
import verifyAdmin from "../middlewares/verification/verifyAdmin.js";

// Create a new router object
const router = express.Router();

// Defineing all user routes here
router.route("/create").post(createUser);
router.route("/action/:id").delete(verifyAdmin, deleteUser);
router.route("/list").get(verifyAdmin, getUsersList);

// Export the router object so that it can be used in other modules
export default router;
