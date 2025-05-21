import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bulma/css/bulma.min.css";
import { BASE_URL } from "../utils"; 

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", 
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        alert("Login berhasil!");
        window.location.href = "/notes";
      } else {
        alert(data.message || "Login gagal.");
      }
    } catch (error) {
      alert("Gagal menghubungi server.");
      console.error(error);
    }
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "400px" }}>
        <h1 className="title has-text-centered">Login</h1>
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
                onChange={(e) => setForm({ ...form, username: e.target.value })}
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
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <button type="submit" className="button is-primary is-fullwidth">
              Login
            </button>
          </div>
        </form>

        <p className="has-text-centered mt-3">
          Belum punya akun? <Link to="/register">Daftar di sini</Link>
        </p>
      </div>
    </section>
  );
}
