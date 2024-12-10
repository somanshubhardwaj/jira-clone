import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "lucide-react";
import React from "react";

const TaskViewSwitcher = () => {
  return (
    <Tabs className="flex-1 w-full rounded-lg border ">
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex items-center justify-between flex-col gap-y-2 lg:flex-row ">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger value="table" className="h-8 w-full lg:w-auto">
              Table
            </TabsTrigger>
            <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
              Kanban
            </TabsTrigger>
            <TabsTrigger value="calendar" className="h-8 w-full lg:w-auto">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button size={"sm"} className="w-full lg:w-auto">
            <PlusIcon className="w-4 h-4" />
            New Task
          </Button>
        </div>
        <Separator className="my-4" />
        <TabsContent value="table" className="mt-0">
          table
        </TabsContent>
        <TabsContent value="kanban" className="mt-0">
          kanban
        </TabsContent>
        <TabsContent value="calendar" className="mt-0">
          calendar
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
