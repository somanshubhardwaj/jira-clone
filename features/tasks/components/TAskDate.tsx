import React from "react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
interface TAskDateProps {
  date: Date;
  className?: string;
}

const TAskDate = ({ date, className }: TAskDateProps) => {
  const days = differenceInDays(date, new Date());
  const isOverdue = days < 0;
  const formattedDate = format(date, "MMM d, yyyy");
  return (
    <div className={cn("text-sm font-medium ", className)}>
      <span
        className={cn(
          "text-sm font-medium text-center justify-center",
          isOverdue && "text-red-500",
          days === 0 && "text-yellow-500",
          days > 0 && "text-green-500"
        )}
      >
        {formattedDate}
      </span>
    </div>
  );
};

export default TAskDate;
