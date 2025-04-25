import React, { useState } from "react";
import cn from "../../utils/cn";

const ProfileImage = (props) => {
  const { profileURL } = props;
  const [profileLoading, setIsProfileLoading] = useState(true);

  return (
    <div
      className={cn(
        `rounded-full w-full h-full hover:ring-opacity-50 transition-all duration-300`,
        profileLoading
          ? "border-animated"
          : "ring-2 ring-mint ring-opacity-80 ring-offset-1 ring-offset-blue"
      )}
    >
      <img
        className={cn(`rounded-full object-cover w-full h-full`)}
        src={profileURL}
        onLoad={() => setIsProfileLoading(false)}
        alt="Profile image"
      />
    </div>
  );
};

export default ProfileImage;
