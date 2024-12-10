import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/rpc";
// import { useRouter } from "next/navigation";

  type ResponseType = InferResponseType<
    (typeof client.api.tasks)["$post"],
    200
  >;
  type RequestType = InferRequestType<(typeof client.api.tasks)["$post"]>;

export function useCreateTask() {
  //   const router = useRouter();
  const queryClient = useQueryClient();
  const mutate = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks.$post({ json });
      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      return await response.json();
    },
    onSuccess: () => {
      //   router.refresh();
      // window.location.reload();
      toast.success("Task created successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error("Failed to create Task");
    },
  });
  return mutate;
}
