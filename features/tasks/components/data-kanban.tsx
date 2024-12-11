import React, { useCallback, useEffect, useState } from "react";
import { Task, TaskStatus } from "../types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import KanbanColumnHeader from "./KanbanColumnHeader";
import KanbanCard from "./KanbanCard";
interface props {
  data: Task[];
}
const boards: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.INPROGRESS,
  TaskStatus.DONE,
  TaskStatus.BACKLOG,
  TaskStatus.INREVIEW,
];
type TasksState = {
  [key in TaskStatus]: Task[];
};
const DataKanban = ({ data }: props) => {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.TODO]: [],
      [TaskStatus.INPROGRESS]: [],
      [TaskStatus.INREVIEW]: [],
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.DONE]: [],
    };
    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });
    Object.keys(initialTasks).forEach((board) => {
      initialTasks[board as TaskStatus].sort((a, b) => a.position - b.position);
    });
    return initialTasks;
  });

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex pverflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 bg-muted mx-2 min-w-[220px] p-1.5 rounded-md"
            >
              <div className="text-sm font-medium text-muted-foreground">
                <KanbanColumnHeader
                  board={board}
                  taskCount={tasks[board].length}
                />
                <Droppable droppableId={board}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-h-[200px] p-1.5"
                    >
                      {tasks[board].map((task, index) => (
                        <Draggable
                          key={task.$id}
                          draggableId={task.$id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <KanbanCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default DataKanban;
