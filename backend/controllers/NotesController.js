import Notes from "../models/NotesModel.js";

// Create Notes
export const createNotes = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const note = await Notes.create({
      title,
      content,
      userId
    });
    res.status(201).json({
      message: "Notes berhasil dibuat",
      data: note
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Notes (per user)
export const getNotes = async (req, res) => {
  const userId = req.user.id;

  try {
    const notes = await Notes.findAll({ where: { userId } });
    res.status(200).json({
      message: "Notes berhasil diambil",
      data: notes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Notes (dengan verifikasi kepemilikan)
export const updateNotes = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.id;
  const { title, content } = req.body;

  try {
    const note = await Notes.findOne({ where: { id: noteId, userId } });
    if (!note) return res.status(404).json({ message: "Catatan tidak ditemukan atau bukan milik Anda" });

    await Notes.update({ title, content }, { where: { id: noteId } });

    res.status(200).json({
      message: "Notes berhasil diupdate"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Notes (dengan verifikasi kepemilikan)
export const deleteNotes = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.id;

  try {
    const note = await Notes.findOne({ where: { id: noteId, userId } });
    if (!note) return res.status(404).json({ message: "Catatan tidak ditemukan atau bukan milik Anda" });

    await Notes.destroy({ where: { id: noteId } });

    res.status(200).json({ message: "Notes berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
