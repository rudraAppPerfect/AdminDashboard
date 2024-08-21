import { User } from "@/app/users/page";
import { create } from "zustand";

export type ModalType = "createUser" | "editUser" | "deleteUser" | "deleteUsers" | "filters";

interface ModalData {
  id? : number,
  usersData? : User[]
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
