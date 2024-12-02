import { Route, Routes, useLocation } from "react-router-dom";
import CreatePage from "./pages/CreatePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./middleware/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import { useEffect } from "react";
import { useAuthStore } from "./store/user";
import PublicRoute from "./middleware/PublicRoute";

function App() {
  const location = useLocation();
  const loadFromLocalStorage = useAuthStore(
    (state) => state.loadFromLocalStorage
  );

  useEffect(() => {
    // Panggil fungsi untuk memuat data dari localStorage saat aplikasi pertama kali dimuat
    loadFromLocalStorage();
  }, []);
  return (
    <>
      {/* Hanya render Navbar jika bukan di halaman Register */}
      {location.pathname !== "/register" && location.pathname !== "/login" && (
        <Navbar />
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/me"
          element={
            // <ProtectedRoute>
            <ProfilePage />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
