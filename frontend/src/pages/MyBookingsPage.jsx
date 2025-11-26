import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/my-bookings.css";
import RescheduleModal from "../components/RescheduleModal";

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);

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

    const cancelBooking = async (id) => {
        if (!window.confirm("Biztosan le szeretnéd mondani a foglalást?")) return;

        try {
            await axios.put(`/api/bookings/${id}/cancel`);
            setBookings((prev) => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
        } catch (err) {
            alert(err.response?.data?.error || "Lemondás sikertelen!");
        }
    };

    const openRescheduleModal = (booking) => {
        setEditing(booking);
    };

    const saveReschedule = async (id, newStart) => {
        try {
            await axios.put(`/api/bookings/${id}/reschedule`, { start_time: newStart });

            setEditing(null);

            // UI frissítése új lekéréssel
            const res = await axios.get("/api/bookings/my");
            setBookings(res.data);

        } catch (err) {
            alert(err.response?.data?.error || "Módosítás sikertelen!");
        }
    };


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
                            <th>Műveletek</th>
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
                                <td className="actions-centered">
                                    {(b.status === "confirmed" || b.status === "pending") &&
                                        new Date(b.start_time) > new Date() && (
                                            <div className="action-buttons">
                                                <button className="btn-edit"
                                                    onClick={() => openRescheduleModal(b)}>
                                                    Módosítás
                                                </button>
                                                <button className="btn-delete"
                                                    onClick={() => cancelBooking(b.id)}>
                                                    Lemondás
                                                </button>
                                            </div>
                                        )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal megjelenítése */}
            {editing && (
                <RescheduleModal
                    booking={editing}
                    onSave={saveReschedule}
                    onClose={() => setEditing(null)}
                />
            )}
        </div>
    );
}
