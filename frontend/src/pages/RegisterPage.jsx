import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import visibleIcon from "../assets/icons/visible.png";
import invisibleIcon from "../assets/icons/invisible.png";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("A két jelszó nem egyezik meg!");
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Regisztráció sikertelen.");
                return;
            }

            navigate("/login");

        } catch (err) {
            setError("Hálózati hiba történt.");
        }
    };


    return (
        <div className="auth-container">
            <h2>Regisztráció</h2>
            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleRegister} className="auth-form" noValidate>
                <div className="mb-3">
                    <label className="form-label">Név</label>
                    <input
                        type="text"
                        className="form-control"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email cím</label>
                    <input
                        type="text"
                        className="form-control"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Jelszó</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword1 ? "text" : "password"}
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword1(!showPassword1)}
                        >
                            {showPassword1 ? <img src={invisibleIcon} alt="Hide password" /> : <img src={visibleIcon} alt="Show password" />}
                        </span>

                    </div>
                    <label className="form-label">Jelszó megerősítése</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword2 ? "text" : "password"}
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword2(!showPassword2)}
                        >
                            {showPassword2 ? <img src={invisibleIcon} alt="Hide password" /> : <img src={visibleIcon} alt="Show password" />}
                        </span>
                    </div>
                </div>
                <button type="submit" className="btn-auth">
                    Regisztráció
                </button>
            </form>
            <p className="auth-link">
                Van már fiókod?{" "}
                <span onClick={() => navigate("/login")}>Jelentkezz be!</span>
            </p>
        </div>


    );
}
