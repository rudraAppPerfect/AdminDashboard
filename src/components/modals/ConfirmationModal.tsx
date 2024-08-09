import React, { useContext } from "react";
import Modal from "../ui/modal/modal";
import { useModal } from "@/hooks/use-modal-store";
import { UserContext, UserContextType } from "@/contextApi/UserState";
import { User } from "@/app/users/page";

const ConfirmationModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const context = useContext(UserContext);
  const { usersArray, setUsersArray } = context as UserContextType;

  const isModalOpen = isOpen && type == "deleteUser";
  return (
    <Modal open={isModalOpen} onClose={onClose} typeOfModal="Delete">
      <div className="flex flex-col justify-center items-center py-4">
        <h1 className="text-base text-black font-medium">
          Are you sure to delete this User ?
        </h1>

        <div className="flex items-center mt-8 justify-between w-full">
          <button
            onClick={() => {
              const updatedArray = usersArray.filter(
                (item: User) => data.id != item.id
              );
              setUsersArray(updatedArray);
              onClose();
            }}
            className="bg-green-400 text-white py-1 px-3 w-[40%] rounded-md"
          >
            Yes
          </button>
          <button onClick={() => onClose()} className="bg-red-400 text-white py-1 px-3 w-[40%] rounded-md">
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
