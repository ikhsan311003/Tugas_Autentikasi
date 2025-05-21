import db from "../config/database.js";
import users from "./UsersModel.js";
import notes from "./NotesModel.js";

users.hasMany(Notes, { foreignKey: "userId", onDelete: "CASCADE" });
notes.belongsTo(Users, { foreignKey: "userId" });

(async () => {
  try {
    await db.authenticate();
    console.log("Koneksi database berhasil!");

    await db.sync({ alter: true });
    console.log("Semua tabel berhasil disinkronisasi.");
  } catch (err) {
    console.error("Gagal konek DB:", err);
  }
})();

export { users, notes };