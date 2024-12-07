import { getCurrent } from "@/features/auth/actions";
import { getWorkspaceInfo } from "@/features/workspaces/actions";
import Join from "@/features/workspaces/components/join";
import { redirect } from "next/navigation";
import React from "react";
interface JoinProps {
  params: {
    workspaceId: string;
  };
}
const Page = async ({ params }: JoinProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  const workspace = await getWorkspaceInfo({ workspaceId: params.workspaceId });
  if (!workspace) redirect("/");
  return (
    <div className="w-full lg:max-w-xl">
      <Join initialData={workspace} />
    </div>
  );
};

export default Page;
