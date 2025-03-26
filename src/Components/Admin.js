import React, { useEffect, useState } from "react";
import { signOut } from "../Utils/AuthUtils";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const AdminPage = () => {
    const [usersWithRoles, setUsersWithRoles] = useState([]);
    const [usersWithoutRoles, setUsersWithoutRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState({});
    const [refreshToggle, setRefreshToggle] = useState(false);
    const navigate = useNavigate();
    const token = sessionStorage.getItem("idToken");

    useEffect(() => {
        fetch("https://4pylyp4kl3.execute-api.us-east-2.amazonaws.com/prod/fetch-users",
          {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,  // Replace with actual token
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setUsersWithRoles(data.usersWithRoles);
                setUsersWithoutRoles(data.usersWithoutRoles);
            })
            .catch((error) => console.error("Error fetching users:", error));
    }, [refreshToggle]);

    const handleRoleChange = (userId, role) => {
        setSelectedRoles((prev) => ({
            ...prev,
            [userId]: role,
        }));
    };

    const assignRole = (userId) => {
        const role = selectedRoles[userId];
        if (!role) return alert("Please select a role");
        const groupName = role
        fetch("https://4pylyp4kl3.execute-api.us-east-2.amazonaws.com/prod/assign-role", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, groupName }),
        })
        .then((res) => res.json())
        .then(() => {
            alert("Role assigned successfully!");
            setRefreshToggle((prev) => !prev);
        })
        .catch((error) => console.error("Error assigning role:", error));
    };

    const handleSignOut = () => {
        signOut();
        navigate("/");
      };

      return (
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Admin Panel</h2>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
      
          <h3>Users with Assigned Roles</h3>
          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {usersWithRoles.length > 0 ? (
                usersWithRoles.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
      
          <h3 style={{ marginTop: "30px" }}>Users without Roles</h3>
          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>Email</th>
                <th>Assign Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {usersWithoutRoles.length > 0 ? (
                usersWithoutRoles.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={selectedRoles[user.userId] || ""}
                        onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                      >
                        <option value="">Select Role</option>
                        <option value="Admins">Admin</option>
                        <option value="Devs">Dev</option>
                        <option value="Users">User</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => assignRole(user.userId)}
                        disabled={!selectedRoles[user.userId]}
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">All users have roles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
      
};

export default AdminPage;
