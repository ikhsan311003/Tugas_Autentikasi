import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import { useNavigate, useParams, Link } from 'react-router-dom';
import { BASE_URL } from '../utils';

const EditUser = () => {
  const [author, setAuthor] = useState("");
  const [about, setAbout] = useState("");
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const getUserById = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${id}`);
      setAuthor(response.data.author);
      setAbout(response.data.about);
      setNote(response.data.note);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/users"); // Redirect jika pengguna tidak ditemukan
    }
  }, [id, navigate]);

  useEffect(() => {
    getUserById();
  }, [getUserById]);

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${BASE_URL}/users/${id}`, {
        author,
        about,
        note
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-three-quarters">
        <h1 className="title is-2 has-text-centered">Edit Catatan Pengguna</h1>
        <form onSubmit={updateUser}>
          <div className="field">
            <label className="label">Author</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">About</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="About"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Note</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note"
              />
            </div>
          </div>
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <Link to="/" className="button is-light">
                Cancel
              </Link>
            </div>
            <div className="control">
              <button type="submit" className="button is-primary">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
