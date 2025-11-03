import { useEffect, useState } from "react";
import "../../styles/services.css";
import "../../styles/global.css";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError("Nem sikerült betölteni a felhasználókat.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });
            if (!res.ok) throw new Error("Hozzáadás sikertelen");
            await fetchUsers();
            setNewUser({ name: "", email: "", role: "user" });
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdateRole = async (id, role) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });
            if (!res.ok) throw new Error("Módosítás sikertelen");
            await fetchUsers();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törlöd a felhasználót?")) return;
        await fetch(`/api/users/${id}`, { method: "DELETE" });
        fetchUsers();
    };

    if (loading) return <p>Betöltés...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="admin-container">
            <h2>Felhasználók</h2>

            <form onSubmit={handleAddUser} className="service-form mt-3 mb-4">
                <input
                    type="text"
                    placeholder="Név"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                />
                <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Hozzáadás</button>
            </form>

            <table className="table align-middle">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Név</th>
                        <th>Email</th>
                        <th>Szerep</th>
                        <th>Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>
                                <select
                                    value={u.role}
                                    onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleDelete(u.id)}>
                                    Törlés
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
