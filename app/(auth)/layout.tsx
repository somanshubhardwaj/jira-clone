"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  return (
    <main className="bg-neutral-100 min-h-screen w-full">
      {" "}
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Image src="/next.svg" alt="Logo" width={152} height={56} />

          <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
            <Button variant={"secondary"}>
              {pathname === "/sign-in" ? "Sign Up" : "Sign In"}
            </Button>
          </Link>
        </nav>
        <div className="flex flex-col items-center justify-center p-4 md:p-14">
          {" "}
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
