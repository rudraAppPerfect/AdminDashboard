import React, { useContext, useEffect } from "react";
import Modal from "../ui/modal/modal";
import { useModal } from "@/hooks/use-modal-store";
import { UserContext, UserContextType } from "@/contextApi/UserState";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const schema = z.object({
  name: z.string().min(1,"Name is required"),
  email: z.string().email("Invalid email").min(1,"Email is required"),
  role: z.string().min(1,"Role is required"),
  status: z.string().min(1,"Status is required"),
});

type FormData = z.infer<typeof schema>;


const UserModal = () => {                                                                                                                                                                                                                                                                              
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && (type==='createUser' || type==='editUser');

  const context = useContext(UserContext);
  const { usersArray, setUsersArray, id } = context as UserContextType;

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (type === "editUser" && id !== null) {
      const user = usersArray.find((user) => user.id === id);
      if (user) {
        setValue("name", user.name);
        setValue("email", user.email);
        setValue("role", user.role);
        setValue("status", user.status);
      }
    }
  }, [type, id, usersArray, setValue]);

  const handleCreate = (data: FormData) => {
    setUsersArray([
      ...usersArray,
      {
        id: usersArray.length + 1,
        ...data,
      },
    ]);
    reset();
    onClose();
  };

  const handleUpdate = (data: FormData) => {
    const updatedUsers = usersArray.map((user) =>
      user.id === id ? { ...user, ...data } : user
    );
    setUsersArray(updatedUsers);
    reset();
    onClose();
  };

  const onSubmit = (data: FormData) => {
    if (type === "createUser") {
      handleCreate(data);
    } else {
      handleUpdate(data);
    }
  };

  return (
    <Modal open={isModalOpen} onClose={onClose} typeOfModal="UserModal">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 pb-4"
      >
        <h1 className="text-base text-gray-400 ml-1 mb-1">Name :</h1>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              placeholder="Enter name"
              className="w-full p-5 outline-none border-[2px] border-gray-200 rounded-lg"
            />
          )}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <h1 className="text-base text-gray-400 ml-1 mb-1">Email :</h1>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              placeholder="Enter E-mail"
              className="w-full p-5 outline-none border-[2px] border-gray-200 rounded-lg"
            />
          )}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <h1 className="text-base text-gray-400 ml-1 mb-1">Status :</h1>
        <Controller
          name="status"
          control={control}
          defaultValue="Active"
          render={({ field }) => (
            <select
              {...field}
              className="p-3 outline-none border-[2px] border-gray-200 rounded-lg"
            >
              <option value="Active">Active</option>
              <option value="Not Active">Not Active</option>
            </select>
          )}
        />
        {errors.status && (
          <p className="text-red-500">{errors.status.message}</p>
        )}

        <h1 className="text-base text-gray-400 ml-1 mb-1">Role :</h1>
        <Controller
          name="role"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              placeholder="Enter User's Role"
              className="w-full p-5 outline-none border-[2px] border-gray-200 rounded-lg"
            />
          )}
        />
        {errors.role && <p className="text-red-500">{errors.role.message}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            className="p-2 px-4 bg-green-400 text-white rounded-lg mt-3"
          >
            {type === "createUser" ? "Create" : "Update"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
