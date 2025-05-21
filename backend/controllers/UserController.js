import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register User
export const Register = async (req, res) => {
  const { username, password, confirm_password } = req.body;

  if (!username || !password || !confirm_password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: "Password dan konfirmasi tidak cocok" });
  }

  // Cek apakah username sudah ada
  const existingUser = await Users.findOne({ where: { username } });
  if (existingUser) {
    return res.status(409).json({ message: "Username sudah digunakan" });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({ username, password: hashPassword });

    res.status(201).json({
      message: "User berhasil didaftarkan",
      data: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};

// Login User
export const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Password salah" });

    const payload = { id: user.id, username: user.username };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m"
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d"
    });

    // Simpan refresh token di database
    await Users.update({ refresh_token: refreshToken }, { where: { id: user.id } });

    // Set refresh token di cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ fix untuk dev
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
    });

    res.status(200).json({
      message: "Login berhasil",
      accessToken,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat login", error: error.message });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Refresh token tidak ditemukan" });

  try {
    const user = await Users.findOne({ where: { refresh_token: token } });
    if (!user) return res.status(403).json({ message: "User tidak valid" });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Refresh token tidak valid" });

      const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat memperbarui token", error: error.message });
  }
};

// Logout
export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  try {
    const user = await Users.findOne({ where: { refresh_token: token } });
    if (!user) return res.sendStatus(204);

    await Users.update({ refresh_token: null }, { where: { id: user.id } });
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat logout", error: error.message });
  }
};
