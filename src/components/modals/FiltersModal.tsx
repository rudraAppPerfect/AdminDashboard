import React, { useContext, useState } from "react";
import Modal from "../ui/modal/modal";
import { useModal } from "@/hooks/use-modal-store";
import { UserContext, UserContextType } from "@/contextApi/UserState";
import { Square, SquareCheck } from "lucide-react";

const FiltersModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type == "filters";

  const context = useContext(UserContext);
  const {
    user,
    getUsers,
    usersRole,
    setUsersRole,
    usersStatus,
    setUsersStatus,
  } = context as UserContextType;
  const isAdmin = user?.role === "Admin";

  const handleApply = () => {
    getUsers(1, usersRole, usersStatus);
    onClose();
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={() => {
        onClose();
      }}
      typeOfModal="Delete"
    >
      <div className="flex flex-col pb-4 pt-2 pl-3">
        <div>
          <h1 className="font-semibold text-lg">Role :</h1>
          <div className="flex items-center mt-4">
            <div className="flex items-center gap-2">
              {usersRole == "Admin" || usersRole == "" ? (
                <>
                  <button onClick={() => setUsersRole("User")}>
                    <Square />
                  </button>

                  <h1 className="text-base font-medium">User</h1>
                </>
              ) : (
                <>
                  <button>
                    <SquareCheck onClick={() => setUsersRole("")} />
                  </button>

                  <h1 className="text-base font-medium">User</h1>
                </>
              )}
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2 ml-4">
                {usersRole == "User" || usersRole == "" ? (
                  <>
                    <button onClick={() => setUsersRole("Admin")}>
                      <Square />
                    </button>

                    <h1 className="text-base font-medium">Admin</h1>
                  </>
                ) : (
                  <>
                    <button>
                      <SquareCheck onClick={() => setUsersRole("")} />
                    </button>

                    <h1 className="text-base font-medium">Admin</h1>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h1 className="font-semibold text-lg">Status :</h1>
          <div className="flex items-center mt-4">
            <div className="flex items-center gap-2">
              {usersStatus == "Inactive" || usersStatus == "" ? (
                <>
                  <button onClick={() => setUsersStatus("Active")}>
                    <Square />
                  </button>
                  <h1 className="text-base font-medium">Active</h1>
                </>
              ) : (
                <>
                  <button>
                    <SquareCheck onClick={() => setUsersStatus("")} />
                  </button>
                  <h1 className="text-base font-medium">Active</h1>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 ml-3">
              {usersStatus == "Active" || usersStatus == "" ? (
                <>
                  <button onClick={() => setUsersStatus("Inactive")}>
                    <Square />
                  </button>
                  <h1 className="text-base font-medium">Inactive</h1>
                </>
              ) : (
                <>
                  <button>
                    <SquareCheck onClick={() => setUsersStatus("")} />
                  </button>
                  <h1 className="text-base font-medium">Inactive</h1>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleApply}
            className="p-2 px-4 bg-green-400 text-white rounded-md"
          >
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FiltersModal;
