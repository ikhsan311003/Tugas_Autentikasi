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

// Auth
router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

// ✅ Management user (tambahkan ini kembali)
router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUsersById);
router.post("/users", verifyToken, createUser);
router.patch("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);

// Fallback
router.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});
