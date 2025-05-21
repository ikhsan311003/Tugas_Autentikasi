import express from "express";
import {
  Register,
  Login,
  refreshToken,
  logout,
} from "../controllers/UserController.js";

const router = express.Router();

// ✅ Auth routes (untuk user biasa, kalau masih dipakai)
router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

// ✅ 404 fallback
router.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
