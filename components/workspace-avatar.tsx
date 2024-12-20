import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
interface WorkSpaceAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}
const WorkSpaceAvatar = ({
  image,
  name,
  className,
  fallbackClassName,
}: WorkSpaceAvatarProps) => {
  if (!image) {
    return (
      <Avatar className={cn("size-10 rounded-md", className)}>
        <AvatarFallback
          className={cn(
            "  text-white bg-blue-600 text-lg uppercase font-bold rounded-md",
            fallbackClassName
          )}
        >
          {name[0]}
        </AvatarFallback>
      </Avatar>
    );
  }
  return (
    <div
      className={cn("size-10 relative rounded-md overflow-hidden", className)}
    >
      <Image src={image} alt={name} layout="fill" className="object-cover" />
    </div>
  );
};
export default WorkSpaceAvatar;
