import React from "react";
import cn from "../../utils/cn";

const Button = (props) => {
  const {
    buttonType,
    children,
    handler = () => {},
    isDisabled = false,
    loadingStatus = false,
    className = "",
  } = props;

  const buttonTypes = Object.freeze({
    PRIMARY: "PRIMARY",
    SECONDARY: "SECONDARY",
    TERTIARY: "TERTIARY",
    SPECIAL: "SPECIAL",
  });

  let buttonStyles = "";
  switch (buttonType) {
    case buttonTypes.PRIMARY:
      buttonStyles = "bg-custom-blue hover:bg-opacity-90 text-white border-none";
      break;

    case buttonTypes.SECONDARY:
      buttonStyles =
        "bg-mint border-none text-blue hover:bg-mint hover:bg-opacity-70";
      break;

    case buttonTypes.TERTIARY:
      buttonStyles = "bg-transparent text-teal-600 border-none ";
      break;

    case buttonTypes.SPECIAL:
      buttonStyles = "bg-gradient-special";
      break;

    default:
      break;
  }

  return (
    <button
      className={cn(
        `font-secondary font-medium px-5 py-2 rounded-md text-mint text-[1rem] transition-all duration-200 active:bg-opacity-60`,
        loadingStatus || isDisabled ? "cursor-not-allowed" : "",
        className,
        buttonStyles
      )}
      onClick={handler}
      disabled={loadingStatus || isDisabled ? true : false}
    >
      {children}
    </button>
  );
};

export default Button;
