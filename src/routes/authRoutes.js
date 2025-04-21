//authRoutes
import express from "express";
const router = express.Router();
import { login, register,refresh ,logout} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

router.get("/",  (req, res) => {
    res.render("home");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});
router.get("/lougout", (req, res) => {
  res.render("home");
});

router.post("/login", login);

router.post("/register", register);

router.post("/logout", logout);

router.post("/refresh", refresh);

export default router;