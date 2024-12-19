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
import OtpPage from "./pages/OtpPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import RequestResetPasswordPage from "./pages/RequestResetPasswordPage";

function App() {
  const location = useLocation();
  const loadFromLocalStorage = useAuthStore(
    (state) => state.loadFromLocalStorage
  );

  useEffect(() => {
    // Panggil fungsi untuk memuat data dari localStorage saat aplikasi pertama kali dimuat
    loadFromLocalStorage();
  }, []);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // Sinkronisasi token saat pertama kali load
  }, []);

  return (
    <>
      {/* Hanya render Navbar jika bukan di halaman Register */}
      {location.pathname !== "/register" &&
        location.pathname !== "/login" &&
        location.pathname !== "/reset" &&
        location.pathname !== "/forget" &&
        location.pathname !== "/request-reset-password" &&
        location.pathname !== "/otp" && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reset" element={<ChangePasswordPage />} />
        <Route path="/forget" element={<ResetPasswordPage />} />
        <Route
          path="/request-reset-password"
          element={<RequestResetPasswordPage />}
        />{" "}
        {/* Tambahkan rute untuk halaman RequestResetPassword */}
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
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/otp"
          element={
            <ProtectedRoute>
              <OtpPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
