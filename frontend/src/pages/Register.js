import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bulma/css/bulma.min.css";
import { BASE_URL } from "../utils"; 

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm_password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registrasi berhasil, silakan login.");
        window.location.href = "/";
      } else {
        alert(data.message || "Gagal registrasi");
      }
    } catch (error) {
      alert("Gagal menghubungi server.");
      console.error(error);
    }
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "400px" }}>
        <h1 className="title has-text-centered">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Username</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Username"
                required
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                placeholder="Password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Konfirmasi Password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                placeholder="Konfirmasi Password"
                required
                value={form.confirm_password}
                onChange={e => setForm({ ...form, confirm_password: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <button type="submit" className="button is-success is-fullwidth">
              Register
            </button>
          </div>
        </form>

        <p className="has-text-centered mt-3">
          Sudah punya akun? <Link to="/">Login di sini</Link>
        </p>
      </div>
    </section>
  );
}
