import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";
import visibleIcon from "../assets/icons/visible.png";
import invisibleIcon from "../assets/icons/invisible.png";

export default function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const redirectTo = new URLSearchParams(location.search).get("redirect") || null;

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("A két jelszó nem egyezik meg!");
            return;
        }

        try {
            await axios.post("/api/auth/register", {
                name,
                email,
                password,
            });

            // SIkeres regisztráció → Login oldalra
            if (redirectTo) {
                navigate(`/login?redirect=${redirectTo}`);
            } else {
                navigate("/login");
            }

        } catch (err) {
            console.error("🔴 Register error:", err);

            const message =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Hiba a regisztrációnál!";

            setError(message);
        }
    };

    return (
        <div className="auth-bg">
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
                                <img src={showPassword1 ? invisibleIcon : visibleIcon} alt="" />
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
                                <img src={showPassword2 ? invisibleIcon : visibleIcon} alt="" />
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="btn-auth">
                        Regisztráció
                    </button>
                </form>

                <p className="auth-link">
                    Van már fiókod?{" "}
                    <span
                        onClick={() =>
                            navigate(
                                redirectTo
                                    ? `/login?redirect=${redirectTo}`
                                    : "/login"
                            )
                        }
                    >
                        Jelentkezz be!
                    </span>
                </p>
            </div>
        </div>
    );
}
