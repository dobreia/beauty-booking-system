import { useEffect, useState } from "react";
import axios from "axios";

export default function BookingPage() {
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    service_id: "",
    employee_id: "",
    date: "",
  });
  const [message, setMessage] = useState("");

  // szolgáltatások + dolgozók betöltése
  useEffect(() => {
    const loadData = async () => {
      const [s, e] = await Promise.all([
        axios.get("/api/services"),
        axios.get("/api/employees"),
      ]);
      setServices(s.data);
      setEmployees(e.data);
    };
    loadData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/bookings", form);
      setMessage("✅ Sikeres foglalás! Köszönjük.");
      setForm({ name: "", email: "", service_id: "", employee_id: "", date: "" });
    } catch (err) {
      setMessage("❌ Hiba: " + (err.response?.data?.error || "Ismeretlen hiba"));
    }
  };

  return (
    <div className="container mt-5">
      <h2>Időpontfoglalás</h2>
      <form onSubmit={handleSubmit} className="booking-form mt-3">
        <input
          name="name"
          placeholder="Név"
          className="form-control mb-2"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="form-control mb-2"
          value={form.email}
          onChange={handleChange}
        />

        <select
          name="service_id"
          className="form-select mb-2"
          value={form.service_id}
          onChange={handleChange}
        >
          <option value="">Válassz szolgáltatást</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          name="employee_id"
          className="form-select mb-2"
          value={form.employee_id}
          onChange={handleChange}
        >
          <option value="">Válassz dolgozót</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>

        <input
          name="date"
          type="datetime-local"
          className="form-control mb-3"
          value={form.date}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-primary w-100">Foglalás küldése</button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
