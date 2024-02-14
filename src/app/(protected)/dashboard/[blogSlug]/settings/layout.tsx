import React, { ReactNode } from "react";
import SettingsNav from "./settings-nav";

export default function BlogSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="p-4 pb-0">
        <SettingsNav />
      </div>
      <div>{children}</div>
    </>
  );
}
