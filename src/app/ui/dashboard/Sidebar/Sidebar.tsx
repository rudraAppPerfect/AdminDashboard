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

  const { logout } = authContext;

  return (
    <div className="text-white w-[25%] min-h-screen bg-slate-800 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src={AVATAR}
            alt="user"
            className="w-[15%] h-[15%] rounded-full"
          />

          <div className="ml-4">
            <h1 className="text-lg">Rudra</h1>
            <h1 className="text-sm">Administrator</h1>
          </div>
        </div>

        <button
          className="bg-red-300 rounded-md py-1 w-[50%]"
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
