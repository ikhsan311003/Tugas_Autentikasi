import Admin from "../models/AdminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register Admin
export const Register = async (req, res) => {
  console.log("📥 Register Request:", req.body);
  const { username, password, confirm_password } = req.body;

  if (!username || !password || !confirm_password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: "Password dan konfirmasi tidak cocok" });
  }

  const existingAdmin = await Admin.findOne({ where: { username } });
  if (existingAdmin) {
    return res.status(409).json({ message: "Username sudah digunakan" });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, password: hashPassword });

    res.status(201).json({
      message: "Admin berhasil didaftarkan",
      data: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};

// Login Admin
export const Login = async (req, res) => {
  console.log("📥 Login request body:", req.body);
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) return res.status(404).json({ message: "Admin tidak ditemukan" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: "Password salah" });

    const payload = { id: admin.id, username: admin.username };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    await Admin.update({ refresh_token: refreshToken }, { where: { id: admin.id } });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ accessToken, message: "Login admin berhasil" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat login", error: error.message });
  }
};

// Refresh Token Admin
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

  try {
    const admin = await Admin.findOne({ where: { refresh_token: token } });
    if (!admin) return res.status(403).json({ message: "Admin tidak valid" });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Token tidak valid" });

      const accessToken = jwt.sign(
        { id: admin.id, username: admin.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal refresh token", error: error.message });
  }
};

// Logout Admin
export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  try {
    const admin = await Admin.findOne({ where: { refresh_token: token } });
    if (!admin) return res.sendStatus(204);

    await Admin.update({ refresh_token: null }, { where: { id: admin.id } });
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    res.status(500).json({ message: "Gagal logout", error: error.message });
  }
};
