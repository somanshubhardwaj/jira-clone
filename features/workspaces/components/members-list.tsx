"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Fragment } from "react";
import MembersAvatar from "@/features/members/components/MembersAvatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { memberRole } from "@/features/members/type";
import { useConfirm } from "@/hooks/use-confirm";
const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetMembers({ workspaceId });
  const { mutate: dltMember, isPending: dltPending } = useDeleteMember();
  const { mutate: updateMember, isPending: updatePending } = useUpdateMember();
  const [ConfirmDialog, Confirm] = useConfirm(
    "Are you sure you want to delete this member?",
    "This action cannot be undone.",
    "destructive"
  );
  const handleDelete = async (memberId: string) => {
    const ok = await Confirm();
    if (ok) {
      dltMember(
        { param: { memberId } },
        {
          onSuccess: () => {
            window.location.reload();
          },
        }
      );
    }
  };
  const handleUpdate = (memberId: string, role: memberRole) => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };
  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 space-y-4">
        <Button asChild variant={"secondary"} size={"sm"}>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeft className="size-4 mr-2" /> Back
          </Link>
        </Button>
        <CardTitle
          className="
        text-xl font-bold"
        >
          Members
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        {data?.documents.map((member, index) => (
          <Fragment key={index}>
            <div className="flex items-center gap-2">
              <MembersAvatar
                name={member.name}
                className="size-10"
                fallbackClassName="text-lg"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="ml-auto "
                    variant={"secondary"}
                    size={"icon"}
                  >
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() => handleUpdate(member.$id, memberRole.ADMIN)}
                    disabled={updatePending || dltPending}
                  >
                    Set as admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() => handleUpdate(member.$id, memberRole.MEMBER)}
                    disabled={updatePending || dltPending}
                  >
                    Set as member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium text-amber-700"
                    onClick={() => handleDelete(member.$id)}
                    disabled={updatePending || dltPending}
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="my-2.5" />
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

export default MembersList;
