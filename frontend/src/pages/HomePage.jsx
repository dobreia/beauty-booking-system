import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/home.css';

export default function HomePage() {
    const [health, setHealth] = useState(null);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetch("/api/health")
            .then((res) => res.json())
            .then(setHealth)
            .catch(() => setHealth({ ok: false }));
    }, []);

    const handleClick = () => {
        if (user) {
            navigate("/booking");
        } else {
            navigate("/services");
        }
    };

    return (
        <header className="hero">
            <div className="overlay" />
            <div className="content container">
                <h1 className="title">Varázs Szépségszalon</h1>
                <div className="separator"></div>
                <h2 className="subtitle">Fodrászat • Smink • Manikűr • Tanácsadás</h2>

                <button onClick={handleClick} className="btn-cta">
                    Időpont foglalása
                </button>
            </div>
        </header>
    );
}
