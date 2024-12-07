import { cn } from "@/lib/utils";
import { Settings, UserIcon } from "lucide-react";
import Link from "next/link";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
const routes = [
  {
    label: "Home",
    href: "/",
    icons: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icons: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icons: Settings,
    activeIcon: Settings,
  },
  {
    label: "Members",
    href: "/members",
    icons: UserIcon,
    activeIcon: UserIcon,
  },
];

export const Navigation = () => {
  return (
    <ul className="mt-4">
      {routes.map((route, index) => {
        const isActive = false;
        const Icon = isActive ? route.activeIcon : route.icons;
        return (
          <Link key={index} href={route.href}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer text-neutral-500 hover:text-primary",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              <span className="ml-2">{route.label}</span>
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
