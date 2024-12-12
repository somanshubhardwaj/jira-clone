"use client";
import { UserButton } from "@/features/auth/components/userButton";
import React from "react";
import MobileSidebar from "./mobile-sidebar";
import { usePathname } from "next/navigation";
const pathNameMap = {
  tasks: {
    title: "Tasks",
    description: "Manage and track your team's tasks and progress",
  },
  projects: {
    title: "Projects",
    description: "View and manage all your workspace projects",
  },
  members: {
    title: "Members",
    description: "Manage workspace members and their roles",
  },
  settings: {
    title: "Settings",
    description: "Configure your workspace settings and preferences",
  },
  analytics: {
    title: "Analytics",
    description: "View insights and metrics about your workspace",
  },
};
const defaultTitle = "Home";
const defaultDescription = "Lorem ipsum dolor sit amet.";
const Navbar = () => {
  const pathName = usePathname();
  const pathnameParts = pathName.split("/");
  const { title, description } = pathNameMap[
    pathnameParts[3] as keyof typeof pathNameMap
  ] || {
    title: defaultTitle,
    description: defaultDescription,
  };
  return (
    <nav className="pt-4 px-6 flex items-center justify-between w-full">
      <div className=" flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold ">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};

export default Navbar;
