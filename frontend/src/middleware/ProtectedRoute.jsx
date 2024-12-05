import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/user";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (!isInitialized) {
    return <p>Loading...</p>; // Loading jika belum selesai inisialisasi
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
