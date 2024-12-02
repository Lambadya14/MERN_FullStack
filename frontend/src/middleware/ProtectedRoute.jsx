import PropTypes from "prop-types"; // Tambahkan ini
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/user";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Validasi props
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Validasi children sebagai node dan wajib
};

export default ProtectedRoute;
