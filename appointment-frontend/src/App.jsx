import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthContext
import Home from "./pages/Home";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/appointments" element={<MyAppointments />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
