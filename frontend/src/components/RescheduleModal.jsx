import { useState, useEffect } from "react";
import "../styles/modal.css";

export default function RescheduleModal({ booking, onSave, onClose }) {

    const formatForInput = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM formátum
    };

    const [newStart, setNewStart] = useState("");

    // 🔹 Amikor megnyílik a modal → töltsük be az eredeti dátumot
    useEffect(() => {
        if (booking?.start_time) {
            setNewStart(formatForInput(booking.start_time));
        }
    }, [booking]);

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h3>Időpont módosítása</h3>

                <form className="modal-form">
                    <label>Új kezdési időpont:</label>
                    <input
                        type="datetime-local"
                        value={newStart}
                        onChange={(e) => setNewStart(e.target.value)}
                        required
                    />

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                        >
                            Mégse
                        </button>
                        <button
                            type="button"
                            className="btn-success"
                            onClick={() => onSave(booking.id, newStart)}
                            disabled={!newStart}
                        >
                            Mentés
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
