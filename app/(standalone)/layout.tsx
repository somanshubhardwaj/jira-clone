import React from "react";

import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen max-w-screen-2xl mx-auto flex justify-center items-center bg-neutral-200 p-6">
      {children}
    </div>
  );
};

export default Layout;
