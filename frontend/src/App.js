import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import EditUser from "./components/EditUser";

// 🔽 Tambahkan komponen baru
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 Autentikasi */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={<Notes />} />

        {/* 🧑‍💼 Manajemen user (tugas sebelumnya) */}
        <Route path="/users" element={<UserList />} />
        <Route path="/add" element={<AddUser />} />
        <Route path="/edit/:id" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
