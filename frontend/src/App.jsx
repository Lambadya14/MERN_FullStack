import { Route, Routes, useLocation } from "react-router-dom";
import CreatePage from "./pages/CreatePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import { useAuthStore } from "./store/user";

function App() {
  const location = useLocation();
  const loadFromLocalStorage = useAuthStore(
    (state) => state.loadFromLocalStorage
  );

  // Muat data dari localStorage saat aplikasi dimulai
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <>
      {/* Hanya render Navbar jika bukan di halaman Register */}
      {location.pathname !== "/register" && location.pathname !== "/login" && (
        <Navbar />
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create" element={<CreatePage />} />
      </Routes>
    </>
  );
}

export default App;
