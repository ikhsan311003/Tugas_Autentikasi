import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ---------- AUTHENTICATION ----------
export const Register = async (req, res) => {
  const { username, password, confirm_password } = req.body;
  if (!username || !password || !confirm_password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }
  if (password !== confirm_password) {
    return res.status(400).json({ message: "Password dan konfirmasi tidak cocok" });
  }

  const existing = await User.findOne({ where: { username } });
  if (existing) {
    return res.status(409).json({ message: "Username sudah digunakan" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });
    res.status(201).json({ message: "Register berhasil", user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: "Error saat registrasi", error: err.message });
  }
};

export const Login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Password salah" });

    const payload = { id: user.id, username: user.username };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: "Gagal login", error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

  try {
    const user = await User.findOne({ where: { refresh_token: token } });
    if (!user) return res.status(403).json({ message: "User tidak valid" });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Token tidak valid" });

      const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
      });

      res.status(200).json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal refresh token", error: error.message });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  try {
    const user = await User.findOne({ where: { refresh_token: token } });
    if (!user) return res.sendStatus(204);

    await User.update({ refresh_token: null }, { where: { id: user.id } });
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    res.status(500).json({ message: "Gagal logout", error: error.message });
  }
};

// ---------- CRUD USER (PROTECTED) ----------
export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["id", "username"]  // hide password!
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsersById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: { id: req.params.id },
      attributes: ["id", "username"]
    });
    if (!response) return res.status(404).json({ message: "User tidak ditemukan" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashPassword });
    res.status(201).json({ msg: "User Created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    await User.update(
      { username, password: hashPassword },
      { where: { id: req.params.id } }
    );
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
