"use client";

import Image from "next/image";
import React, { useContext } from "react";
import AVATAR from "../../../../../public/noavatar.png";
import AuthContext from "@/contextApi/AuthProvider";

const Sidebar = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { logout, user } = authContext;

  return (
    <div className="text-white hidden lg:block w-[25%] min-h-screen bg-slate-800 p-8">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center w-fit">
          <Image
            src={AVATAR}
            alt="user"
            className="w-[15%] h-[15%] rounded-full"
          />

          <div className="ml-4">
            <h1 className="text-lg">{user?.email.split("@")[0]}</h1>
            <h1 className="text-sm">{user?.role}</h1>
          </div>
        </div>

        <button
          className="bg-red-300 rounded-md py-1 xl:w-[50%] w-[70%]"
          onClick={() => logout()}
        >
          Log Out
        </button>
      </div>

      <button className="mt-8 p-4 rounded-xl bg-[#2e374a] w-full">
        <h1 className="text-start">Users</h1>
      </button>
    </div>
  );
};

export default Sidebar;
