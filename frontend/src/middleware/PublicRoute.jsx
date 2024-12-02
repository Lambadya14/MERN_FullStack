import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/user";

const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  console.log("Is Authenticated:", isAuthenticated); // Menambahkan log

  if (isAuthenticated) {
    // Pastikan untuk tidak terus-menerus memicu perubahan
    return <Navigate to="/" />;
  }

  return children;
};

// Validasi props
PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
