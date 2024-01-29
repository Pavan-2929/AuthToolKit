import express from "express";
import {
  loginController,
  registerController,
  googleController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/google", googleController);

export default router;
