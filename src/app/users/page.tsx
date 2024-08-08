"use client";

import { useModal } from "@/hooks/use-modal-store";
import Image from "next/image";
import UserImage from "../../../public/noavatar.png";
import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextType } from "@/contextApi/UserState";
import PaginationControls from "@/components/ui/Pagination/PaginationControls";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const UsersPage = () => {
  const { onOpen } = useModal();
  const [searchText, setSearchText] = useState("");

  const context = useContext(UserContext);
  const {
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
  } = context as UserContextType;

  const [tempArray, setTempArray] = useState(usersArray);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    let finalResults = usersArray;

    if (searchText) {
      finalResults = usersArray.filter((user: User) =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setTempArray(finalResults);
  }, [searchText,usersArray]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = tempArray.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-12 w-full">
      <div className="bg-slate-700 p-4 rounded-lg w-full flex items-center justify-between">
        <h1 className="text-white">Dashboard</h1>
        <button
          className="bg-green-400 text-white p-1 px-3 rounded-md outline-none"
          onClick={() => onOpen("createUser")}
        >
          Create +
        </button>
      </div>

      <div className="bg-slate-700 text-white p-4 rounded-lg mt-8">
        <input
          type="text"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          placeholder="Search User"
          className="text-black p-1 px-4 rounded-md outline-none"
        />
        <table>
          <thead>
            <tr>
              <td className="p-4">Name</td>
              <td className="p-4 px-16">Email</td>
              <td className="p-4 px-16">Role</td>
              <td className="p-4 px-16">Status</td>
              <td className="p-4 px-16">Action</td>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user: User) => {
              return (
                <tr key={user.id}>
                  <td className="p-4">
                    <div className="flex items-center">
                      <Image
                        src={UserImage}
                        alt="user"
                        className="w-[5%] h-[5%] rounded-full"
                      />
                      <h1 className="ml-3">{user.name}</h1>
                    </div>
                  </td>
                  <td className="py-4 pl-12">{user.email}</td>
                  <td className="py-4 pl-12">{user.role}</td>
                  <td className="py-4 pl-12">{user.status}</td>
                  <td className="py-4 pl-12">
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          setId(user.id);
                          setName(user.name);
                          setEmail(user.email);
                          setRole(user.role);
                          setStatus(user.status);
                          onOpen("editUser");
                        }}
                        className="py-1 px-3 bg-yellow-400 text-white rounded-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          const updatedArray = usersArray.filter(
                            (item: User) => user.id != item.id
                          );
                          setUsersArray(updatedArray);
                        }}
                        className="py-1 px-3 bg-red-400 text-white rounded-md ml-3"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <PaginationControls
          currentPage={currentPage}
          totalItems={tempArray.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default UsersPage;
