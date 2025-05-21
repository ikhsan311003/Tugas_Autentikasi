import express from "express";
import {
  Register,
  Login,
  refreshToken,
  logout,
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// 🔐 Auth routes
router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

// 👥 User management routes
router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUsersById);
router.post("/users", verifyToken, createUser);
router.patch("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);


// ✅ Export default agar bisa di-import tanpa {}
export default router;
