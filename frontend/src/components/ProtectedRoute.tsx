import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "./ui/Spinner";

// Guards app routes. New users (not yet onboarded) are sent to /onboarding so
// they see the AI-driven first-run flow instead of an empty dashboard.
// skipOnboardingGate lets the /onboarding route itself render for logged-in users.
export function ProtectedRoute({
  children,
  skipOnboardingGate = false
}: {
  children: ReactNode;
  skipOnboardingGate?: boolean;
}) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner label="Loading" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!skipOnboardingGate && user.onboarded === false) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}