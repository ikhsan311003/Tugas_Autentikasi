import express from "express";
import {
  Register,
  Login,
  refreshToken,
  logout
} from "../controllers/AdminController.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/admin/register", Register);
router.post("/admin/login", Login);
router.get("/admin/token", refreshToken);
router.delete("/admin/logout", logout);

export default router;
