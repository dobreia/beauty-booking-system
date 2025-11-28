import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import BookingPage from './pages/BookingPage'
import ServiceAdminPage from './pages/admin/ServiceAdminPage'
import UserPage from './pages/admin/UserPage'
import EmployeesPage from './pages/admin/EmployeesPage'
import BookingAdminPage from './pages/admin/BookingAdminPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ServicePage from './pages/ServicePage'
import MyBookingsPage from './pages/MyBookingsPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        {/* Navigációs sáv */}
        <Navbar user={user} setUser={setUser} />
        <Routes>
          {/* Nyilvános oldalak */}
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/register" element={<RegisterPage setUser={setUser} />} />

          {/* Admin oldalak */}
          <Route path="/admin/services" element={<ServiceAdminPage />} />
          <Route path="/admin/users" element={<UserPage />} />
          <Route path="/admin/employees" element={<EmployeesPage />} />
          <Route path="/admin/bookings" element={<BookingAdminPage />} />
          <Route path='/admin' element={<AdminDashboardPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
