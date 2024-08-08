"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";

type User = {
  email: string;
  password: string;
};

export interface AuthContextType {
  user: User | null;
  register: (email: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwt.verify(
          token,
          `${process.env.NEXT_JWT_SECRET}`
        );
        setUser(decodedUser as User);
        router.push("/users");
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  const register = (email: string, password: string) => {
    const newUser = { email, password };
    const token = jwt.sign(newUser, `${process.env.NEXT_JWT_SECRET}`);
    localStorage.setItem("token", token);
    setUser(newUser);
    router.push("/users");
  };

  const login = (email: string, password: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwt.verify(
          token,
          `${process.env.NEXT_JWT_SECRET}`
        ) as User;
        if (decodedUser.email === email && decodedUser.password === password) {
          setUser(decodedUser as User);
          router.push("/users");
        } else {
          console.error("Invalid credentials");
        }
      } catch (error) {
        console.error("Invalid token");
      }
    }
    else{
      console.error("User doesn't exist");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
