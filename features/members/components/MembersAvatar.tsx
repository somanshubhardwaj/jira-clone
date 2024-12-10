import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
interface AvatarProps {
  name: string;
  className?: string;
  fallbackClassName?: string;
}
const MembersAvatar = ({ name, className, fallbackClassName }: AvatarProps) => {
  return (
    <Avatar
      className={cn(
        "size-5  transition border border-neutral-300 rounded-full",
        className
      )}
    >
      <AvatarFallback
        className={cn(
          " bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center",
          fallbackClassName
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
export default MembersAvatar;