import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/auth.css";
import visibleIcon from "../assets/icons/visible.png";
import invisibleIcon from "../assets/icons/invisible.png";

export default function LoginPage({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // 🔄 redirect paraméter kiolvasása
    const redirectTo =
        new URLSearchParams(location.search).get("redirect") || null;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("/api/auth/login", { email, password });

            // mentés, auth fejléc frissítés
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setUser(res.data.user);
            axios.defaults.headers.common["Authorization"] =
                "Bearer " + res.data.token;

            // 👉 PRIORITÁS: ha volt redirect → oda megy vissza
            if (redirectTo) {
                navigate(redirectTo);
                return;
            }

            // admin user → admin felületre
            if (res.data.user.role === "admin") {
                navigate("/admin");
                return;
            }

            // normál user → főoldal
            navigate("/");

        } catch (err) {
            setError(err.response?.data?.error || "Hibás email vagy jelszó.");
        }
    };

    return (
        <div className="auth-bg">
            <div className="auth-container">
                <h2>Bejelentkezés</h2>

                {error && <p className="text-danger text-center">{error}</p>}

                <form className="auth-form" onSubmit={handleLogin} noValidate>
                    <div className="mb-3">
                        <label className="form-label">Email cím</label>
                        <input
                            type="text"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Jelszó</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <img src={invisibleIcon} alt="Hide password" />
                                ) : (
                                    <img src={visibleIcon} alt="Show password" />
                                )}
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="btn-auth">
                        Belépés
                    </button>
                </form>

                <p className="auth-link">
                    Nincs még fiókod?{" "}
                    <span
                        onClick={() =>
                            navigate(
                                redirectTo
                                    ? `/register?redirect=${redirectTo}`
                                    : "/register"
                            )
                        }
                    >
                        Regisztrálj itt!
                    </span>
                </p>
            </div>
        </div>
    );
}
