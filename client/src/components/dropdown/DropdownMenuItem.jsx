import React from "react";
import { MenuItem } from "@headlessui/react";
import cn from "../../utils/cn";
import { Link } from "react-router-dom";

const DropdownMenuItem = (props) => {
  const { className, item, path, action } = props;

  return (
    <MenuItem>
      {({ focus }) => (
        <Link
          onClick={action}
          to={path}
          className={cn(
            "block px-4 py-2 text-[1rem] font-secondary tracking-tight font-medium rounded-md hover:bg-mintExtreme-400 transition-all duration-300",
            item.toLowerCase() === "signout"
              ? "text-red-500 hover:bg-red-800 hover:text-white"
              : "",
            className
          )}
        >
          {item}
        </Link>
      )}
    </MenuItem>
  );
};

export default DropdownMenuItem;
