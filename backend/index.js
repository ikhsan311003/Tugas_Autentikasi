import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import UserRoute from "./routes/UserRoute.js";
import NotesRoute from "./routes/NotesRoute.js";
import AdminRoute from "./routes/AdminRoute.js";

dotenv.config();

const app = express();

// ✅ Daftar origin yang diperbolehkan untuk CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://frontend-service-dot-b-10-451011.uc.r.appspot.com",
  "https://your-custom-domain.com"
];

// ✅ Konfigurasi CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ Gunakan semua routes
app.use(UserRoute);
app.use(NotesRoute);
app.use(AdminRoute);

// ✅ Fallback jika route tidak ditemukan
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
