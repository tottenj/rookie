// AuthProvider.tsx — just tracks state, no splash logic
import { getAuth, onAuthStateChanged, User } from "@react-native-firebase/auth";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(getAuth(), (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
}
