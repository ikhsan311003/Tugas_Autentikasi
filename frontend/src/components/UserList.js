import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { BASE_URL } from '../utils';

const UserList = () => {
  const [users, setUser] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (id) =>{
    try {
        await axios.delete(`${BASE_URL}/users/${id}`);
        getUsers();
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-three-quarters">
        <h1 className="title is-2 has-text-centered">Daftar Catatan Pengguna</h1>
        <div className="mb-4">
          <Link to={`add`} className='button is-success'>
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
            <span>Add New</span>
          </Link>
        </div>
        <div className="table-container">
          <table className="table is-bordered is-striped is-fullwidth is-hoverable">
            <thead>
              <tr>
                <th>No</th>
                <th>Author</th>
                <th>About</th>
                <th>Note</th>
                <th className="has-text-centered">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.author}</td>
                  <td>{user.about}</td>
                  <td>{user.note}</td>
                  <td className="has-text-centered">
                    <div className="buttons is-centered">
                      <div className="is-flex is-align-items-center"> {/* Container untuk berdampingan */}
                        <Link to={`edit/${user.id}`} className="button is-small is-info mr-1">
                          <span className="icon">
                            <i className="fas fa-edit"></i>
                          </span>
                          <span>Edit</span>
                        </Link>
                        <button onClick={()=> deleteUser(user.id)} className="button is-small is-danger">
                          <span className="icon">
                            <i className="fas fa-trash"></i>
                          </span>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
