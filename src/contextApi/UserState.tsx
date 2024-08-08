"use client";

import { User } from "@/app/users/page";
import { useState, createContext, ReactNode } from "react";

export interface UserContextType {
  usersArray: User[];
  setUsersArray: (newArray: User[]) => void;
  name: string;
  setName: (newString: string) => void;
  email: string;
  setEmail: (newString: string) => void;
  role: string;
  setRole: (newString: string) => void;
  status: string;
  setStatus: (newString: string) => void;
  id: number;
  setId: (newId: number) => void;
}

const UserContext = createContext<UserContextType | null>(null);

const STATUS = "Active";

const UserState = ({ children }: { children: ReactNode }) => {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@gmail.com",
      role: "Software Engineer",
      status: STATUS,
    },
    {
      id: 2,
      name: "Rohan",
      email: "rohan2@gmail.com",
      role: "Frontend Developer",
      status: STATUS,
    },
    {
      id: 3,
      name: "John Doe",
      email: "johndoe@gmail.com",
      role: "Software Engineer",
      status: STATUS,
    },
    {
      id: 4,
      name: "Rohan",
      email: "rohan2@gmail.com",
      role: "Frontend Developer",
      status: STATUS,
    },
    {
      id: 5,
      name: "John",
      email: "johndoe@gmail.com",
      role: "Software Engineer",
      status: STATUS,
    },
    {
      id: 6,
      name: "Rohit",
      email: "rohan2@gmail.com",
      role: "Frontend Developer",
      status: STATUS,
    },
  ];

  const [usersArray, setUsersArray] = useState(users);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(STATUS);
  const [id, setId] = useState(0);

  return (
    <UserContext.Provider
      value={{
        usersArray,
        setUsersArray,
        name,
        setName,
        email,
        setEmail,
        role,
        setRole,
        status,
        setStatus,
        id,
        setId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
export { UserContext };
