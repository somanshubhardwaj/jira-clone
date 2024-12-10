"use client";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Link } from "lucide-react";
import React from "react";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AlertTriangle className="size-10 text-red-500" />
      {/* <h1 className="text-4xl font-bold">ErrorPage</h1> */}
      <p>
        Something went wrong. Please try again later or contact support if the
        problem persists.
      </p>
      <Button variant={"secondary"} asChild>
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
