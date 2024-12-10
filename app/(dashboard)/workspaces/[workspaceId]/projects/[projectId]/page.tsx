import React from "react";
import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";
interface props {
  params: Promise<{ projectId: string }>;
}
const page = async (props: props) => {
  const params = await props.params;
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return <div>page {params.projectId}</div>;
};

export default page;
