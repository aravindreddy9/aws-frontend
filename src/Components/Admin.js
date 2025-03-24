import React, { useEffect, useState } from "react";
import "./Admin.css";

const AdminPage = () => {
    const [usersWithRoles, setUsersWithRoles] = useState([]);
    const [usersWithoutRoles, setUsersWithoutRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState({});  // Stores selected roles for unassigned users

    useEffect(() => {
        fetch("https://4pylyp4kl3.execute-api.us-east-2.amazonaws.com/prod/fetch-users")
            .then((res) => res.json())
            .then((data) => {
                setUsersWithRoles(data.usersWithRoles);
                setUsersWithoutRoles(data.usersWithoutRoles);
            })
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

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
            },
            body: JSON.stringify({ userId, groupName }),
        })
        .then((res) => res.json())
        .then(() => {
            alert("Role assigned successfully!");
            window.location.reload(); // Refresh list
        })
        .catch((error) => console.error("Error assigning role:", error));
    };

    return (
        <div>
            <h2>Users with Assigned Roles</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {usersWithRoles.map((user) => (
                        <tr key={user.userId}>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Users without Roles</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Assign Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {usersWithoutRoles.map((user) => (
                        <tr key={user.userId}>
                            <td>{user.email}</td>
                            <td>
                                <select onChange={(e) => handleRoleChange(user.userId, e.target.value)}>
                                    <option value="">Select Role</option>
                                    <option value="Admins">Admin</option>
                                    <option value="Devs">Dev</option>
                                    <option value="Users">User</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={() => assignRole(user.userId)}>Assign</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;
