import React from "react";
import NavLink from "./nav-link";

export interface NavProps {
  links: { href: string; name: string }[];
}

export default function Nav({ links }: NavProps) {
  return (
    <nav>
      <ul className="flex">
        {links.map((link) => {
          return (
            <li key={link.href}>
              <NavLink href={link.href}>{link.name}</NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
