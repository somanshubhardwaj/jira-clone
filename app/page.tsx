"use client";
import { UserButton } from "@/features/auth/components/userButton";
export default function Home() {
  return (
    <div className="flex gap-4 p-5">
      only logged in users can see this
      <UserButton />
    </div>
  );
}
