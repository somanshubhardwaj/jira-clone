"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateWorkspaceSchema } from "../schema";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { CopyIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "../type";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useUpdateWorkspace } from "../api/use-update-workspace ";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { toast } from "sonner";
import { useResetCode } from "../api/use-resetcode-workspace";
interface CreateWorkspaceFormProps {
  onCancel?: () => void;
  initialData: Workspace;
}
export const EditWorkspaceForm = ({
  onCancel,
  initialData,
}: CreateWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();
  const { mutate: reset, isPending: isResetting } = useResetCode();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "Are you sure you want to delete this workspace?",
    "destructive"
  );
  const [ResetDialog, confirmReset] = useConfirm(
    "Reset Invite Link",
    "Are you sure you want to reset the invite link?This will invalidate the previous invite link",
    "destructive"
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialData,
      image: initialData.imageUrl ?? "",
    },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteWorkspace(
      {
        param: { workspaceId: initialData.$id },
      },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };
  const handleReset = async () => {
    const ok = await confirmReset();
    if (!ok) return;
    reset({
      param: { workspaceId: initialData.$id },
    });
  };
  const onSubmit = (data: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...data,
      image: data.image instanceof File ? data.image : "",
    };
    mutate(
      { form: finalValues, param: { workspaceId: initialData.$id } },
      {
        onSuccess: () => {
          // form.reset();
          // router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };
  const fullInviteLink = `${window.location.origin}/workspaces/${initialData.$id}/join/${initialData.inviteCode}`;
  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex items-center p-7 gap-x-4 flex-row">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialData.$id}`)
            }
          >
            <FaLongArrowAltLeft /> Back
          </Button>
          <CardTitle>{initialData.name}</CardTitle>
        </CardHeader>
        <div className="px-7">
          <Separator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WorkSpace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workspace name" />
                      </FormControl>{" "}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              alt="logo"
                              fill
                              className="object-cover "
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px] flex items-center justify-center bg-neutral-200">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Workspace Icon</p>
                          <p className="text-sm text-muted-foreground">
                            jpg, jpeg, png, svg up to 1MB
                          </p>
                          <input
                            type="file"
                            accept="
                          .png , .jpg, .jpeg, .svg"
                            ref={inputRef}
                            disabled={isPending}
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <Button
                            onClick={() => inputRef.current?.click()}
                            type="button"
                            disabled={isPending}
                            variant={"teritary"}
                            size={"xs"}
                            className="w-fit mt-2"
                          >
                            Upload Image
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <div className="py-2 flex items-center justify-between">
                <Button
                  onClick={onCancel}
                  variant="secondary"
                  type="button"
                  size={"lg"}
                  disabled={isPending}
                  className={cn(!onCancel && "invisible")}
                >
                  Cancel
                </Button>
                <Button type="submit" size={"lg"} disabled={isPending}>
                  Update Workspace
                </Button>
              </div>{" "}
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use invite link to add members to this workspace
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input value={fullInviteLink} disabled className="flex-1" />
                <Button
                  // size={"sm"}
                  variant={"secondary"}
                  className="size-12"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(fullInviteLink)
                      .then(() =>
                        toast.success("Invite Link Copied to clipboard")
                      )
                  }
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>

            <Button
              className="mt-6 w-fit ml-auto"
              variant="destructive"
              size={"sm"}
              type="button"
              disabled={isPending || isResetting}
              onClick={handleReset}
            >
              Reset Invite Link
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible. All the data associated with
              the workspace will be lost.
            </p>
            <Button
              className="mt-6 w-fit ml-auto"
              variant="destructive"
              size={"sm"}
              type="button"
              disabled={isPending || isDeletingWorkspace}
              onClick={handleDelete}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
