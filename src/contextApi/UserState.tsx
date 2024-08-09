"use client";

import { User } from "@/app/users/page";
import { useState, createContext, ReactNode } from "react";
import { faker } from '@faker-js/faker';

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

  const generateFakeUsers = (count: number): User[] => {
    const users: User[] = [];
  
    for (let i = 1; i <= count; i++) {
      const user: User = {
        id: i,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: 'User',
        status: faker.helpers.arrayElement(['Active', 'Inactive']),
      };
      users.push(user);
    }
    users.push({
      id:1000,
      name:'Rahul',
      email:'rahul@gmail.com',
      role:'Admin',
      status:'Active'
    })
    return users;
  };
  
  const fakeUsers = generateFakeUsers(999);

  const [usersArray, setUsersArray] = useState(fakeUsers);
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
