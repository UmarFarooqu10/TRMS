import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import { authService } from "../services/auth.service";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../utils/token";

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export interface AuthUser {
  id: number;
  role: UserRole;
  email: string;
}

type DecodedToken = {
  id: number;
  role: UserRole;
  email?: string;
  exp?: number;
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isReady: false,
  login: async () => {
    throw new Error("AuthContext not initialized");
  },
  logout: () => {
    throw new Error("AuthContext not initialized");
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  const setUserState = useCallback((value: AuthUser | null) => {
    setUser(value);

    if (typeof window === "undefined") return;
    if (value) {
      localStorage.setItem("trms:user", JSON.stringify(value));
    } else {
      localStorage.removeItem("trms:user");
    }
  }, []);

  const syncUserFromToken = useCallback((token: string | null) => {
    if (!token) {
      setUserState(null);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserState({
        id: decoded.id,
        role: decoded.role,
        email: decoded.email ?? "",
      });
    } catch (error) {
      clearAccessToken();
      setUserState(null);
    }
  }, [setUserState]);

  useEffect(() => {
    const token = getAccessToken();
    const storedUser =
      typeof window !== "undefined"
        ? localStorage.getItem("trms:user")
        : null;

    if (token && storedUser) {
      setUserState(JSON.parse(storedUser));
    } else {
      syncUserFromToken(token);
    }

    setIsReady(true);
  }, [setUserState, syncUserFromToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authService.login({ email, password });
      setAccessToken(response.data.accessToken);
      setUserState(response.data.user);
      return response.data.user;
    },
    [setUserState]
  );

  const logout = useCallback(() => {
    clearAccessToken();
    setUserState(null);
  }, [setUserState]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isReady,
      login,
      logout,
    }),
    [user, isReady, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
