import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { DropdownMenuItem, ProfileImage } from "../";

const DropdownMenu = (props) => {
  const { dropdownContent, username, email, profileURL } = props;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton>
        <div className="w-8 h-8">
          <ProfileImage profileURL={profileURL} />
        </div>
      </MenuButton>

      <MenuItems
        transition
        className="absolute top-0 right-full z-10 mr-4 mt-1 w-56 p-3 origin-top-right rounded-md bg-custom-dark border border-light shadow-dark ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in backdrop-blur-lg"
      >
        <div className="flex items-start justify-start text-mint font-semibold p-2 mb-2 border-b border-light border-opacity-20 gap-3">
          <div className="w-10 h-10">
            <ProfileImage profileURL={profileURL} />
          </div>
          <div className="flex flex-col">
            <span className="font-light font-secondary text-sm">
              @
              {username?.length > 14 ? username.slice(0, 14) + "..." : username}
            </span>
            <span className="text-sm font-extralight font-secondary text-opacity-70 text-mint">
              {email?.length > 14 ? email.slice(0, 14) + "..." : email}
            </span>
          </div>
        </div>

        {dropdownContent?.map((content) => (
          <DropdownMenuItem
            key={content.name}
            item={content.name}
            action={content.action || null}
            path={content.path || null}
          />
        ))}
      </MenuItems>
    </Menu>
  );
};

export default DropdownMenu;
