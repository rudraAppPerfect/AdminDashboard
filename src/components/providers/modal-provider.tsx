"use client";

import { useEffect, useState } from "react";
import UserModal from "../modals/UserModal";

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
    </>
  );
};

export default ModalProvider;
