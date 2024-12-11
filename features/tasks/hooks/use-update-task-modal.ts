import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";

export function useUpdateTaskModal() {
  const [taskId, setTaskId] = useQueryState(
    "update-task",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true })
  );
  return {
    taskId,
    open: (taskId: string) => setTaskId(taskId),
    close: () => setTaskId(null),
    setTaskId,
  };
}
