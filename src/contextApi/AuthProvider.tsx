"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
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

type RegisteredUsers = {
  email: string;
  password: string;
  token: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState(
    [] as RegisteredUsers[]
  );
  const {push} = useRouter();

  useEffect(() => {
    const jwtToken = localStorage.getItem("token");
    console.log(jwtToken)
    if (jwtToken) {
      try {
        const decodedUser = jwt.verify(jwtToken, `${process.env.NEXT_JWT_SECRET}`);
        setUser(decodedUser as User);
        push("/users");
      } catch (error) {
        console.error("Invalid token");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = (email: string, password: string) => {
    const newUser = { email, password };
    const token = jwt.sign(newUser, `${process.env.NEXT_JWT_SECRET}`);
    localStorage.setItem("token", token);
    const newRegisteredUser = { newUser, token };
    setRegisteredUsers([...registeredUsers, { ...newUser, token }]);
    setUser(newUser);
    push("/users");
  };

  const login = (email: string, password: string) => {
    let found = false;
    for (let user of registeredUsers) {
      if (user.email === email && user.password == password) {
        setUser(user);
        push("/users");
        found = true;
        break;
      }
    }
    if (!found) {
      console.error("User not found");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    push("/");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
