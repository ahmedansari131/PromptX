import { useState } from "react";

const useDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialogHandler = () => {
    setIsDialogOpen(true);
  };

  const closeDialogHandler = () => {
    setIsDialogOpen(false);
  };
  return { openDialogHandler, closeDialogHandler, isDialogOpen };
};

export default useDialog;
