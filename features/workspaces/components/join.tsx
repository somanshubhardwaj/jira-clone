"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useJoinWorkspace } from "../api/useJoin";
import { useInvite } from "../hooks/use-invite-code";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useRouter } from "next/navigation";
const Join = ({ initialData }: { initialData: any }) => {
  const router = useRouter();
  const { mutate, isPending } = useJoinWorkspace();
  const code = useInvite();
  const workspaceId = useWorkspaceId();
  const onSubmit = () => {
    mutate(
      {
        param: { workspaceId },
        json: { code },
      },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}`);
        },
      }
    );
  };
  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          You are inivited to join <strong>{initialData.name}</strong>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <div className="flex items-center justify-between flex-col lg:flex-row">
          <Button
            className="w-full lg:w-fit"
            variant={"secondary"}
            size={"lg"}
            type="button"
            asChild
            disabled={isPending}
          >
            <Link href={"/"}>Cancel</Link>
          </Button>
          <Button
            className="w-full lg:w-fit"
            size={"lg"}
            type="button"
            disabled={isPending}
            onClick={onSubmit}
          >
            Join workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Join;
