import React, { ReactNode } from "react";
import { cn } from "~/lib/utils";

export function List({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ul className={cn("grid md:grid-cols-2 xl:grid-cols-3 gap-4", className)}>
      {children}
    </ul>
  );
}

export function ListItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <li>
      <div className={cn("p-4 rounded-md border", className)}>{children}</div>
    </li>
  );
}
