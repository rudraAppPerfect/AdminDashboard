"use client";

import { User } from "@/app/users/page";
import { useState, createContext, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

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
  user: User | undefined;
  setUser: (newUser: User) => void;
  logOut: () => void;
  totalUsers: number;
  setTotalUsers: (value: number | ((prev: number) => number)) => void;
  getUsers: (page: number) => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
}

const UserContext = createContext<UserContextType | null>(null);

const STATUS = "Active";

const UserState = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter();
  const [usersArray, setUsersArray] = useState([] as User[]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(STATUS);
  const [id, setId] = useState(0);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const logOut = () => {
    localStorage.removeItem("token");
    setUser(undefined);
    push("/");
  };

  const getUsers = async (page: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/api/users?page=${page}`,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      setUsersArray(response.data.data);
      setTotalUsers(response.data.meta.totalUsers);
    } catch (error) {
      let message;
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.message;
      } else message = String(error);
      toast.error(message);
    }
  };

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
        user,
        setUser,
        logOut,
        totalUsers,
        setTotalUsers,
        getUsers,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
export { UserContext };
