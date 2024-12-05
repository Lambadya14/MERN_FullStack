import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/user";

const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (!isInitialized) {
    return <p>Loading...</p>; // Tampilkan loading jika belum selesai inisialisasi
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
