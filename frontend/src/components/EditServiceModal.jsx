import { useState } from "react";
import "../styles/modal.css";

export default function EditServiceModal({ service, onClose, onSave, token }) {
    const [form, setForm] = useState({
        name: service.name,
        duration_minutes: service.duration_minutes,
        price_cents: service.price_cents,
        active: service.active,
    });

    const [error, setError] = useState(null);

    const updateField = (field, value) => {
        setForm({ ...form, [field]: value });
        setError(null); // 🔹 hibát törli, miután a user javít
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await fetch(`/api/services/${service.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...form,
                    duration_minutes: parseInt(form.duration_minutes),
                    price_cents: parseInt(form.price_cents),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Módosítás sikertelen.");
                return;
            }

            onSave(service.id, data);
            onClose();

        } catch (err) {
            setError("Hálózati hiba történt! Kérlek próbáld újra.");
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <h3>Szolgáltatás szerkesztése</h3>

                {error && <p className="modal-error">{error}</p>}

                <form onSubmit={handleSubmit} className="modal-form" noValidate>
                    <label>Név</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                    />

                    <label>Időtartam (perc)</label>
                    <input
                        type="number"
                        value={form.duration_minutes}
                        onChange={(e) => updateField("duration_minutes", e.target.value)}
                    />

                    <label>Ár (Ft)</label>
                    <input
                        type="number"
                        value={form.price_cents}
                        onChange={(e) => updateField("price_cents", e.target.value)}
                    />

                    <div className="switch-row">
                        <span>Aktív</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={form.active}
                                onChange={() => updateField("active", !form.active)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-delete" onClick={onClose}>
                            Mégse
                        </button>
                        <button type="submit" className="btn-success">
                            Mentés
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
