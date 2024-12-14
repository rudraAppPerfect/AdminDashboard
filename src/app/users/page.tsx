"use client";

import { useModal } from "@/hooks/use-modal-store";
import Image from "next/image";
import UserImage from "../../../public/noavatar.png";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext, UserContextType } from "@/contextApi/UserState";
import PaginationControls from "@/components/ui/Pagination/PaginationControls";
import { Square, SquareCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import SearchBar from "@/components/ui/SearchBar/SearchBar";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  password: string;
}

const UsersPage = () => {
  const { onOpen } = useModal();
  const [toDelete, setToDelete] = useState([] as User[]);

  const { push } = useRouter();

  const context = useContext(UserContext);
  const {
    usersArray,
    setName,
    setEmail,
    setRole,
    setStatus,
    setId,
    logOut,
    user,
    setUser,
    totalUsers,
    currentPage,
    setCurrentPage
  } = context as UserContextType;

  const [isAdmin, setIsAdmin] = useState(user?.role === "Admin");
  const itemsPerPage = 10;

  useEffect(() => {
    setToDelete([]);
  }, [usersArray]);

  const getUserDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/api/getUser`,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      setUser(response.data);
      setIsAdmin(response.data.role === "Admin");
    } catch (error) {
      let message;
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.message;
      } else message = String(error);
      toast.error(message);
    }
  }, [setUser]);

  useEffect(() => {
    const jwtToken = localStorage.getItem("token");
    if (jwtToken) {
      try {
        getUserDetails();
        push("/users");
      } catch (error) {
        console.error("Invalid token");
      }
    } else {
      push("/");
    }
  }, [push, getUserDetails]);

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSelectAll = () => {
    setToDelete(usersArray);
  };

  const handleDeSelectAll = () => {
    setToDelete([]);
  };

  const handleDeSelect = (user: User) => {
    const updated = toDelete.filter((item: User) => item != user);
    setToDelete(updated);
  };

  const handleEdit = (user: User) => {
    setId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
    onOpen("editUser");
  };

  return (
    <div className="w-full flex flex-col lg:py-12 py-4 items-center">
      <div className="bg-slate-700 p-4 rounded-lg w-[98%] sm:w-[90%] flex items-center  justify-between mt-2">
        <h1 className="text-white hidden lg:block">
          Total Users: {totalUsers}
        </h1>
        <button
          className="bg-red-300 lg:hidden rounded-md py-1 w-[20%] font-medium"
          onClick={() => logOut()}
        >
          Log Out
        </button>
        {isAdmin && (
          <button
            className="bg-green-400 text-white p-1 px-3 rounded-md outline-none"
            onClick={() => onOpen("createUser")}
          >
            Create +
          </button>
        )}
      </div>

      <div className="bg-slate-700 text-white p-4 rounded-lg mt-8 h-full mb-4 w-[98%] sm:w-[90%] ">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <SearchBar />
            {isAdmin && (
              <div>
                <h1 className="text-white ml-4">
                  Total Selected Users : {toDelete.length}
                </h1>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <button
              onClick={() => onOpen("filters")}
              className="bg-orange-400 p-1 px-2 rounded-md mr-3"
            >
              Filters
            </button>
            {toDelete.length > 0 && (
              <button
                onClick={() => onOpen("deleteUsers", { usersData: toDelete })}
                className="bg-red-400 text-white p-1 px-2 rounded-md"
              >
                Delete All
              </button>
            )}
          </div>
        </div>
        {usersArray.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <h1 className="text-white font-bold text-2xl">No Users Found.</h1>
          </div>
        ) : (
          <table className="w-full mt-4 text-xs sm:text-base">
            <thead>
              <tr>
                {isAdmin && (
                  <td className="w-[4%]">
                    <div className="flex justify-center items-center">
                      {toDelete.length != 10 ? (
                        <button onClick={handleSelectAll}>
                          <Square />
                        </button>
                      ) : (
                        <button onClick={handleDeSelectAll}>
                          <SquareCheck />
                        </button>
                      )}
                    </div>
                  </td>
                )}
                <td className="w-[16%] md:pl-4">Name</td>
                <td className="w-[20%] text-center">Email</td>
                <td className="w-[20%] text-center">Role</td>
                <td className="w-[20%] text-center">Status</td>
                {isAdmin && <td className="w-[20%] text-center">Action</td>}
              </tr>
            </thead>
            <tbody>
              {usersArray?.map((user: User) => {
                return (
                  <tr key={user.id}>
                    {isAdmin && (
                      <td className="w-[4%] py-4">
                        <div className="flex items-center justify-center">
                          {toDelete.includes(user) ? (
                            <button onClick={() => handleDeSelect(user)}>
                              <SquareCheck />
                            </button>
                          ) : (
                            <button
                              onClick={() => setToDelete([...toDelete, user])}
                            >
                              <Square />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                    <td className="w-[16%] py-4">
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
                    {isAdmin && (
                      <td className="w-[20%] text-center py-4">
                        <div className="md:flex items-center justify-center">
                          <button
                            onClick={() => handleEdit(user)}
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
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalItems={totalUsers}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UsersPage;
