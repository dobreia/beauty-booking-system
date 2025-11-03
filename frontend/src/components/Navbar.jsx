import { Link, NavLink } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark ">
            <div className="container">
                {/* Bal oldal - logó vagy cím */}
                <Link className="navbar-brand fw-semibold" to="/">
                   Varázs Szépségszalon
                </Link>

                {/* Hamburger menü mobilra */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Menü"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Jobb oldal - menüelemek */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">
                                Kezdőlap
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/admin/services">
                                Szolgáltatások
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/admin/users">
                                Felhasználók
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/admin/employees">
                                Dolgozók
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/admin/bookings">
                                Foglalások
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
