import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan di header" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid atau sudah kadaluarsa" });
    }

    // Simpan user ke request untuk digunakan selanjutnya
    req.user = {
      id: decoded.id,
      username: decoded.username
    };

    next();
  });
};
