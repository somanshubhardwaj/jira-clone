"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useCurrent } from "@/features/auth/api/use-current";
import { useLogout } from "@/features/auth/api/use-logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, LogOut } from "lucide-react";
export const UserButton = () => {
  const { data: user, isLoading } = useCurrent();
  const { mutate: logout } = useLogout();
  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-100">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) {
    return null;
  }
  const { name, email } = user;
  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase() ?? "U";
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300 ">
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-10  transition border border-neutral-300 ">
            <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center text-xl">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col items-center justify-center mb-2">
          <p className="text-sm  text-neutral-900">
            <strong>{name || "User"}</strong>
          </p>
          <p className="text-xs  text-neutral-500">
            <strong>{email}</strong>
          </p>
        </div>

        <Separator />

        <DropdownMenuItem
          onClick={() => logout}
          className="h-10 mt-3 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
        >
          <LogOut className="size-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
