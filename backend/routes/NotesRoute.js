import express from "express";
import {
  createNotes,
  getNotes,
  updateNotes,
  deleteNotes
} from "../controllers/NotesController.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/notes", verifyToken, getNotes);
router.post("/notes", verifyToken, createNotes);
router.patch("/notes/:id", verifyToken, updateNotes);
router.delete("/notes/:id", verifyToken, deleteNotes);

export default router;
