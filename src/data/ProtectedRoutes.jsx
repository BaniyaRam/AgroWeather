import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("loggedInUser"); // match login storage key
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
