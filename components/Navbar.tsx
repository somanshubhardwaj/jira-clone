import { UserButton } from "@/features/auth/components/userButton";
import React from "react";
import MobileSidebar from "./mobile-sidebar";

const Navbar = () => {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between w-full">
      <div className=" flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold ">Home</h1>
        <p className="text-muted-foreground">Lorem ipsum dolor sit amet.</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};

export default Navbar;
