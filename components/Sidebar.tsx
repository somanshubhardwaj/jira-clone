import Link from "next/link";
import React from "react";
import { Separator } from "./ui/separator";
import { Navigation } from "./Navigation";
import WorkspaceSwitcher from "./work-switcher";
import Projects from "./Projects";

const Sidebar = () => {
  return (
    <aside className="bg-neutral-100 w-full p-4 h-full">
      <Link href={`/`}>logo</Link>
      <Separator className="my-3" />
      <WorkspaceSwitcher />
      <Separator className="my-3" />
      <Navigation />
      <Separator className="my-3" />
      <Projects />
    </aside>
  );
};

export default Sidebar;
