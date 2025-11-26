import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/my-bookings.css";

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleString("hu-HU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });


    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get("/api/bookings/my");
                setBookings(res.data);
            } catch (err) {
                setError("Nem sikerült betölteni a foglalásokat.");
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) return <p>Betöltés...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="my-bookings-container">
            <h2 className="my-bookings-title">Saját foglalásaim</h2>

            {bookings.length === 0 ? (
                <p className="no-bookings">Nincs még foglalásod.</p>
            ) : (
                <table className="my-bookings-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Szolgáltatás</th>
                            <th>Dolgozó</th>
                            <th>Kezdés</th>
                            <th>Befejezés</th>
                            <th>Státusz</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.map((b) => (
                            <tr key={b.id}>
                                <td>{b.id}</td>
                                <td>{b.service_name}</td>
                                <td>{b.employee_name}</td>
                                <td>{formatDate(b.start_time)}</td>
                                <td>{formatDate(b.end_time)}</td>
                                <td>
                                    <span className={`status-badge status-${b.status}`}>
                                        <span className="status-dot"></span>
                                        {b.status === "confirmed"
                                            ? "Jóváhagyva"
                                            : b.status === "pending"
                                                ? "Függőben"
                                                : "Elutasítva"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
