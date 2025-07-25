import { ReactNode } from "react";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
