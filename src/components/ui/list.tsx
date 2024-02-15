import React, { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

interface ListProps extends HTMLAttributes<HTMLUListElement> {}

export function List({ children, className, ...props }: ListProps) {
  return (
    <ul
      className={cn("grid md:grid-cols-2 xl:grid-cols-3 gap-4", className)}
      {...props}
    >
      {children}
    </ul>
  );
}

interface ListItemProps extends HTMLAttributes<HTMLDivElement> {}

export function ListItem({ children, className, ...props }: ListItemProps) {
  return (
    <li>
      <div className={cn("p-4 rounded-md border", className)} {...props}>
        {children}
      </div>
    </li>
  );
}
