"use client";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-worspace-info";
import Join from "@/features/workspaces/components/join";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import React from "react";

const Client = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace } = useGetWorkspaceInfo({
    workspaceId,
  });
  return (
    <div className="w-full lg:max-w-xl">
      <Join initialData={workspace} />
    </div>
  );
};

export default Client;
