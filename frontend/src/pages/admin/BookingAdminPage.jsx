import { useEffect, useState } from "react";
import axios from "axios";

export default function BookingAdminPage() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get("/api/bookings");
                console.log("Bookings response:", res.data);
                setBookings(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error(err);
                setError("Nem sikerült betölteni a foglalásokat");
            }
        };
        load();
    }, []);

    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!bookings.length) return <p>Jelenleg nincs foglalás.</p>;

    return (
        <div className="container mt-4">
            <h2>Foglalások listája</h2>
            <table className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Felhasználó</th>
                        <th>Szolgáltatás</th>
                        <th>Munkatárs</th>
                        <th>Kezdés</th>
                        <th>Befejezés</th>
                        <th>Státusz</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b) => (
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td>{b.user_name}</td>
                            <td>{b.service_name}</td>
                            <td>{b.employee_name}</td>
                            <td>{new Date(b.start_time).toLocaleString()}</td>
                            <td>{new Date(b.end_time).toLocaleString()}</td>
                            <td>{b.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
