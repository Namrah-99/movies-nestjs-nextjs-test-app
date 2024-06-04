"use client";

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import AuthScreen from "../views/AuthScreen";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const ProfileDropDown = ({
  signedIn,
  setsignedIn,
  user,
}: {
  signedIn: boolean;
  setsignedIn: (e: boolean) => void;
  user: any;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setsignedIn(!!user);
  }, [user, setsignedIn, open]);

  const logoutHandler = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    toast.success("Log out successful!");
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-4">
      {signedIn ? (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              src={
                user?.image || "https://i.pravatar.cc/150?u=a04258114e29026702d"
              }
              size="lg"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user?.email}</p>
            </DropdownItem>
            <DropdownItem
              key="update-profile"
              onClick={() => router.push("/protected-update-profile")}
            >
              Update Profile
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              onClick={() => logoutHandler()}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <CgProfile
          size={35}
          title="Login/SignUp"
          className="text-2xl cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      )}
      {open && <AuthScreen setOpen={setOpen} />}
    </div>
  );
};

export default ProfileDropDown;
