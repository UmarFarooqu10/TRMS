import { JSX, useEffect } from "react";
import { useRouter } from "next/router";
import { UserRole } from "../contexts/AuthContext";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({
  role,
  children,
}: {
  role?: UserRole;
  children: JSX.Element;
}) => {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!user || (role && user.role !== role)) {
      router.push("/login");
    }
  }, [isReady, role, router, user]);

  if (!isReady) return null;
  if (!user || (role && user.role !== role)) return null;

  return children;
};
