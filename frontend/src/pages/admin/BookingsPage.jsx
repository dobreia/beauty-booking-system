import { useEffect, useState } from "react";
import "../../styles/services.css";
import "../../styles/global.css";

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        setBookings(data);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törlöd a foglalást?")) return;
        await fetch(`/api/bookings/${id}`, { method: "DELETE" });
        fetchBookings();
    };

    return (
        <div className="admin-container">
            <h2>Foglalások</h2>
            <table className="table align-middle">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Felhasználó</th>
                        <th>Szolgáltatás</th>
                        <th>Dátum</th>
                        <th>Státusz</th>
                        <th>Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b) => (
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td>{b.user_name}</td>
                            <td>{b.service_name}</td>
                            <td>{new Date(b.date).toLocaleString("hu-HU")}</td>
                            <td>{b.status}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleDelete(b.id)}>
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
