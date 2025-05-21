import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import UserRoute from "./routes/UserRoute.js";
import NotesRoute from "./routes/NotesRoute.js";
import AdminRoute from "./routes/AdminRoute.js";

dotenv.config();

const app = express();

// ✅ Gunakan environment untuk asal CORS
const allowedOrigins = [
  "http://localhost:5173",                 // saat development
  "http://localhost:3000",
  "http://localhost:3001",
  "https://frontend-service-dot-b-10-451011.uc.r.appspot.com",          // ganti ini sesuai URL Firebase Hosting kamu
  "https://your-custom-domain.com"         // kalau pakai domain sendiri
];

// CORS configuration
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

app.use(cookieParser());
app.use(express.json());

// Routes
app.use(UserRoute);
app.use(NotesRoute);
app.use(AdminRoute);

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
