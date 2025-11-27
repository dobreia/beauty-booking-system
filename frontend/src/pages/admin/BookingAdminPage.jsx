import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../components/AdminHeader";

import "../../styles/booking.css";

export default function BookingAdminPage() {
    const [bookings, setBookings] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [services, setServices] = useState([]);
    const [users, setUsers] = useState([]);

    const [newBooking, setNewBooking] = useState({
        user_id: "",
        service_id: "",
        employee_id: "",
        start_time: "",
    });

    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const authHeader = token ? { Authorization: "Bearer " + token } : {};

    const fetchUsers = async () => {
        try {
            const res = await axios.get("/api/users", { headers: authHeader });
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setUsers([]);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("/api/employees", { headers: authHeader });
            setEmployees(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("EMPLOYEE LOAD ERROR", err);
            setEmployees([]); // fontos!
        }
    };

    const fetchServices = async () => {
        try {
            const res = await axios.get("/api/services", { headers: authHeader });
            setServices(Array.isArray(res.data) ? res.data : []);
        } catch {
            setServices([]);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await axios.get("/api/bookings", { headers: authHeader });
            setBookings(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError("Nem sikerült betölteni a foglalásokat");
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchServices();
        fetchBookings();
        fetchUsers();
    }, []);

    const createBooking = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const body = {
                ...newBooking,
                start_time: newBooking.start_time,
            };

            await axios.post("/api/bookings", body, { headers: authHeader });

            fetchBookings();
            setNewBooking({
                user_id: "",
                service_id: "",
                employee_id: "",
                start_time: "",
            });

        } catch (err) {
            setError(err.response?.data?.error || "Foglalás sikertelen");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`/api/bookings/${id}/status`, { status }, { headers: authHeader });
            fetchBookings();
        } catch {
            alert("Hiba a státusz módosításakor");
        }
    };

    return (
        <div className="admin-container container-lg">
            <AdminHeader title="Foglalások kezelése" />

            {error && <div className="form-error">{error}</div>}

            {/* Új foglalás űrlap */}
            <form onSubmit={createBooking} className="booking-form mt-3 mb-4" noValidate>
                <div className="row g-2">
                    {/* Ügyfél kiválasztás */}
                    <div className="col-md-3">
                        <select
                            value={newBooking.user_id}
                            onChange={(e) => setNewBooking({ ...newBooking, user_id: e.target.value })}
                        >
                            <option value="">Válassz ügyfelet</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Dolgozó */}
                    <div className="col-md-3">
                        <select
                            value={newBooking.employee_id}
                            onChange={(e) => setNewBooking({ ...newBooking, employee_id: e.target.value })}
                        >
                            <option value="">Válassz dolgozót</option>
                            {employees.map(e => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Szolgáltatás */}
                    <div className="col-md-3">
                        <select
                            value={newBooking.service_id}
                            onChange={(e) => setNewBooking({ ...newBooking, service_id: e.target.value })}
                        >
                            <option value="">Válassz szolgáltatást</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Kezdő időpont */}
                    <div className="col-md-2">
                        <input
                            type="datetime-local"
                            value={newBooking.start_time}
                            onChange={(e) => setNewBooking({ ...newBooking, start_time: e.target.value })}
                        />
                    </div>

                    {/* Gomb */}
                    <div className="col-md-1">
                        <button className="btn-success">Felvitel</button>
                    </div>
                </div>
            </form>


            {/* Foglalások táblája */}
            <table className="booking-table">
                <thead>
                    <tr>
                        <th>Ügyfél</th>
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
                            <td data-label="Ügyfél">{b.user_name}</td>
                            <td data-label="Szolgáltatás">{b.service_name}</td>
                            <td data-label="Dolgozó">{b.employee_name}</td>
                            <td data-label="Kezdés">{new Date(b.start_time).toLocaleString("hu-HU")}</td>
                            <td data-label="Befejezés">{new Date(b.end_time).toLocaleString("hu-HU")}</td>

                            <td data-label="Státusz" className="status-cell">
                                <span className={`status-dot ${b.status}`} />
                                {b.status === "pending" ? "Függőben" :
                                    b.status === "confirmed" ? "Jóváhagyva" : "Elutasítva"}
                            </td>

                            <td data-label="Műveletek" className="actions">
                                <div className="action-buttons">
                                    {b.status === "pending" && (
                                        <>
                                            <button className="btn-edit" onClick={() => updateStatus(b.id, "confirmed")}>
                                                Jóváhagyás
                                            </button>
                                            <button className="btn-delete" onClick={() => updateStatus(b.id, "cancelled")}>
                                                Elutasítás
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                            
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
}
