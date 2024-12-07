import { getCurrent } from "@/features/auth/actions";
import { UserButton } from "@/features/auth/components/userButton";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-worspace-form";
import { redirect } from "next/navigation";
export default async function Home() {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");
  return (
    <div className="flex gap-4 p-5 bg-neutral-500 h-full">
      {/* <UserButton /> */}
      <CreateWorkspaceForm />
    </div>
  );
}
