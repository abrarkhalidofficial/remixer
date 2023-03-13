import { Navigate, Outlet } from "react-router-dom";

export default function Protected() {
  const user = null;
  return user !== null ? <Outlet /> : <Navigate to="/" replace />;
}
