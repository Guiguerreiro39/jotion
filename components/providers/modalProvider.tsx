"use client";

import SettingsModal from "@/components/modals/settings-modal";
import { useEffect, useState } from "react";
import SearchCommand from "@/components/search-command";
import CoverImageModal from "@/components/modals/cover-image-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <SearchCommand />
      <SettingsModal />
      <CoverImageModal />
    </>
  );
};

export default ModalProvider;
