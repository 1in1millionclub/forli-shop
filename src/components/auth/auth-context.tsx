"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
  email: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  logout: () => Promise<void>;
  resetPasswordRequest: (email: string) => Promise<{ error: Error | null }>;
  resetPasswordUpdate: (password: string) => Promise<{ error: Error | null }>;
  loginWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  loginWithGoogle: () => Promise<{ error: Error | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    name?: string
  ) => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: async () => {},
  resetPasswordRequest: async () => ({ error: null }),
  resetPasswordUpdate: async () => ({ error: null }),
  loginWithEmail: async () => ({ error: null }),
  loginWithGoogle: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const { data } = await supabase.auth.getClaims();
    if (data?.claims?.sub) {
      setUser({
        id: data.claims.sub,
        email: data.claims.email,
        ...data.claims,
      });
    } else {
      setUser(null);
    }
  }, [supabase.auth]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase.auth]);

  const resetPasswordRequest = useCallback(
    async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      return { error };
    },
    [supabase.auth]
  );

  const resetPasswordUpdate = useCallback(
    async (password: string) => {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    },
    [supabase.auth]
  );

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error) {
        await fetchUser();
        router.push("/");
      }
      return { error };
    },
    [supabase.auth, fetchUser, router]
  );

  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/oauth?next=/`,
      },
    });
    return { error };
  }, [supabase.auth]);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, name?: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name ?? "",
          },
          emailRedirectTo: `${window.location.origin}`,
        },
      });
      return { error };
    },
    [supabase.auth]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        resetPasswordRequest,
        resetPasswordUpdate,
        loginWithEmail,
        loginWithGoogle,
        signUpWithEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
