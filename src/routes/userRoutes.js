// routes/userRouter.js
import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js"; 
import { getAdmin, getHome, getUser  } from "../controllers/userController.js";

const router = express.Router();


router.get("/admin", isAuthenticated, getAdmin);

router.get("/", isAuthenticated, getHome);

router.get("/user", isAuthenticated, getUser );

export default router;