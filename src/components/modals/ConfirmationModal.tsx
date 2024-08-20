import React, { useContext } from "react";
import Modal from "../ui/modal/modal";
import { useModal } from "@/hooks/use-modal-store";
import { UserContext, UserContextType } from "@/contextApi/UserState";
import { User } from "@/app/users/page";
import toast from "react-hot-toast";
import axios from "axios";

const ConfirmationModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const context = useContext(UserContext);
  const { usersArray, setUsersArray, currentPage, getUsers } =
    context as UserContextType;

  const isModalOpen = isOpen && (type == "deleteUser" || type == "deleteUsers");

  const handleDeleteUser = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/api/delete`,
        {
          userId: data.id,
        },
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const updatedArray = usersArray.filter(
        (item: User) => data.id != item.id
      );
      setUsersArray(updatedArray);
      onClose();
      toast.success("Deleted user successfully");
      getUsers(currentPage);
    } catch (error) {
      let message;
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.message;
      } else message = String(error);
      toast.error(message);
    }
  };

  const handleDeleteUsers = async () => {
    try {
      const deleteUser = async (id: number) => {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_HOST}/api/delete`,
          {
            userId: id,
          },
          {
            headers: {
              "auth-token": localStorage.getItem("token"),
            },
          }
        );
        return response;
      };

      if (data?.usersData) {
        await Promise.all(data.usersData.map((el: User) => deleteUser(el.id)));

        const updatedArray = usersArray.filter(
          (item: User) =>
            !data.usersData?.some((user: User) => user.id === item.id)
        );

        setUsersArray(updatedArray);
        toast.success("Deleted users successfully");
      } else {
        toast.error("No users to delete.");
      }

      onClose();
      getUsers(currentPage);
    } catch (error) {
      let message;
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.message;
      } else {
        message = String(error);
      }
      toast.error(message);
    }
  };

  return (
    <Modal open={isModalOpen} onClose={onClose} typeOfModal={"Delete"}>
      <div className="flex flex-col justify-center items-center py-4">
        {type == "deleteUser" ? (
          <h1 className="text-base text-black font-medium">
            Are you sure to delete this User ?
          </h1>
        ) : (
          <>
            <h1 className="text-base text-black font-medium">
              This action will delete following Users :-
            </h1>
            <div className="mt-4">
              {data?.usersData?.map((user: User) => (
                <h1 key={user.id}>{user.name}</h1>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center mt-8 justify-between w-full">
          {type == "deleteUser" ? (
            <button
              onClick={handleDeleteUser}
              className="bg-green-400 text-white py-1 px-3 w-[40%] rounded-md"
            >
              Yes
            </button>
          ) : (
            <button
              onClick={handleDeleteUsers}
              className="bg-green-400 text-white py-1 px-3 w-[40%] rounded-md"
            >
              Yes
            </button>
          )}
          <button
            onClick={() => onClose()}
            className="bg-red-400 text-white py-1 px-3 w-[40%] rounded-md"
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
