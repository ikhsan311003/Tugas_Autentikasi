import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils"; // ✅ Import base URL backend

export default function Notes() {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${BASE_URL}/notes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      const data = await res.json();

      if (res.ok) {
        setNotes(data.data || []);
      } else {
        alert(data.message || "Gagal mengambil catatan");
      }
    } catch (error) {
      alert("Gagal terhubung ke server");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h2 className="title is-3">Catatan Saya</h2>
        {notes.length === 0 ? (
          <p>Belum ada catatan.</p>
        ) : (
          <ul>
            {notes.map((note) => (
              <li key={note.id}>
                <strong>{note.title}</strong>: {note.content}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
