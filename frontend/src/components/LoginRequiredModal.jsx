import "../styles/modal.css";

export default function LoginRequiredModal({ show, onClose, onConfirm }) {
    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <h3>Bejelentkezés szükséges</h3>

                <p className="mb-3">
                    A foglaláshoz először be kell jelentkezned.
                </p>

                <div className="modal-actions">
                    <button className="btn-delete" onClick={onClose}>
                        Mégsem
                    </button>

                    <button className="btn-success" onClick={onConfirm}>
                        Bejelentkezés
                    </button>
                </div>
            </div>
        </div>
    );
}
