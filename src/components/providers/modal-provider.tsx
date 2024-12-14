"use client";

import { useEffect, useState } from "react";
import UserModal from "../modals/UserModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import FiltersModal from "../modals/FiltersModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <UserModal />
      <ConfirmationModal />
      <FiltersModal />
    </>
  );
};

export default ModalProvider;
