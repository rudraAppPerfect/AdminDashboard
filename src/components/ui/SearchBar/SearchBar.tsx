import { UserContext, UserContextType } from "@/contextApi/UserState";
import useDebounce from "@/hooks/debounce";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const SearchBar = () => {
  const context = useContext(UserContext);
  const { getUsers, searchText, setSearchText, currentPage } =
    context as UserContextType;

  const debouncedQuery = useDebounce(searchText, 500);

  useEffect(() => {
    const searchUsers = async (query: string) => {
      if (query === "") {
        getUsers(currentPage, "", "", "");
        return;
      }

      try {
        getUsers(currentPage, "", "", query);
      } catch (error) {
        let message;
        if (axios.isAxiosError(error) && error.response) {
          message = error.response.data.message;
        } else message = String(error);
        toast.error(message);
      }
    };
    if (debouncedQuery || debouncedQuery === "") {
      searchUsers(debouncedQuery);
    }
  }, [debouncedQuery, getUsers, currentPage]);

  return (
    <div>
      <input
        type="text"
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
        placeholder="Search User"
        className="text-black p-1 px-4 rounded-md outline-none"
      />
    </div>
  );
};

export default SearchBar;
