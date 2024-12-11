"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateProjectSchema } from "../schema";
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
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Projects } from "../type";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useUpdateProject } from "../api/use-update-project";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteProject } from "../api/use-delete-project";

interface CreateProjectFormProps {
  onCancel?: () => void;
  initialData: Projects;
}
export const EditProjectForm = ({
  onCancel,
  initialData,
}: CreateProjectFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Project",
    "Are you sure you want to delete this project?",
    "destructive"
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialData,
      image: initialData.imageUrl ?? "",
    },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (ok) {
      deleteProject(
        {
          param: { projectId: initialData.$id },
        },
        {
          onSuccess: () => {
            window.location.href = `/workspaces/${initialData.workspaceId}`;
          },
        }
      );
    }
  };

  const onSubmit = (data: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...data,
      image: data.image instanceof File ? data.image : "",
    };
    mutate(
      { form: finalValues, param: { projectId: initialData.$id } },
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
  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex items-center p-7 gap-x-4 flex-row">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.push(
                      `/workspaces/${initialData.workspaceId}/projects/${initialData.$id}`
                    )
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
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter project name" />
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
                          <p className="text-sm">Project Icon</p>
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
                  Update Project
                </Button>
              </div>{" "}
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a project is irreversible. All the data associated with
              the project will be lost.
            </p>
            <Button
              className="mt-6 w-fit ml-auto"
              variant="destructive"
              size={"sm"}
              type="button"
              disabled={isPending || isDeletingProject}
              onClick={handleDelete}
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
