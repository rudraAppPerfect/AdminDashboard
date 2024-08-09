"use client";

import { useModal } from "@/hooks/use-modal-store";
import Image from "next/image";
import UserImage from "../../../public/noavatar.png";
import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextType } from "@/contextApi/UserState";
import PaginationControls from "@/components/ui/Pagination/PaginationControls";
import AuthContext, { AuthContextType } from "@/contextApi/AuthProvider";

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
    setName,
    setEmail,
    setRole,
    setStatus,
    setId,
  } = context as UserContextType;

  const authContext = useContext(AuthContext);

  const { logout } = authContext as AuthContextType;

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
    setCurrentPage(1);
    setTempArray(finalResults);
  }, [searchText, usersArray]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = tempArray.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="w-full flex flex-col lg:py-12 py-4 items-center">
      <div className="bg-slate-700 p-4 rounded-lg w-[98%] sm:w-[90%] flex items-center justify-between">
        <h1 className="text-white hidden lg:block">Dashboard</h1>
        <button
          className="bg-red-300 lg:hidden rounded-md py-1 w-[20%] font-medium"
          onClick={() => logout()}
        >
          Log Out
        </button>
        <button
          className="bg-green-400 text-white p-1 px-3 rounded-md outline-none"
          onClick={() => onOpen("createUser")}
        >
          Create +
        </button>
      </div>

      <div className="bg-slate-700 text-white p-4 rounded-lg mt-8 w-[98%] sm:w-[90%] ">
        <input
          type="text"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          placeholder="Search User"
          className="text-black p-1 px-4 rounded-md outline-none"
        />
        <table className="w-full mt-4 text-xs sm:text-base">
          <thead>
            <tr>
              <td className="w-[20%] md:pl-4">Name</td>
              <td className="w-[20%] text-center">Email</td>
              <td className="w-[20%] text-center">Role</td>
              <td className="w-[20%] text-center">Status</td>
              <td className="w-[20%] text-center">Action</td>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user: User) => {
              return (
                <tr key={user.id}>
                  <td className="w-[20%] py-4">
                    <div className="flex items-center md:ml-4">
                      <Image
                        src={UserImage}
                        alt="user"
                        className="w-[10%] h-[10%] rounded-full"
                      />
                      <h1 className="lg:ml-3 ml-1">{user.name}</h1>
                    </div>
                  </td>
                  <td className="w-[20%] text-center py-4">{user.email}</td>
                  <td className="w-[20%] text-center py-4">{user.role}</td>
                  <td className="w-[20%] text-center py-4">{user.status}</td>
                  <td className="w-[20%] text-center py-4">
                    <div className="md:flex items-center justify-center">
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
                          onOpen("deleteUser", { id: user.id });
                        }}
                        className="py-1 px-3 mt-2 md:mt-0 bg-red-400 text-white rounded-md ml-3"
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
