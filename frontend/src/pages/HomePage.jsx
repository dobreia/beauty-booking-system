import { useEffect, useState } from "react";
import '../styles/home.css';

export default function HomePage() {
    const [health, setHealth] = useState(null);

    useEffect(() => {
        fetch("/api/health")
            .then((res) => res.json())
            .then(setHealth)
            .catch(() => setHealth({ ok: false }));
    }, []);

    return (
        <header className="hero">
            <div className="overlay" />
            <div className="content container">
                <h1 className="title">Varázs Szépségszalon</h1>
                <div className="separator"></div>
                <h2 className="subtitle">Fodrászat • Smink • Manikűr • Tanácsadás</h2>

                <a href="/booking" className="btn-cta">
                    Időpont foglalása
                </a>
            </div>
        </header>
    );
}
