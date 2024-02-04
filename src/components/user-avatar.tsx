import { User } from "@prisma/client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserAvatar({
  user,
  className,
}: {
  user: Pick<User, "name" | "image" | "email">;
  className?: string;
}) {
  const lastName = user.name?.split(" ")[1];

  return (
    <Avatar className={className}>
      <AvatarImage src={user.image ?? undefined} />
      <AvatarFallback>{lastName}</AvatarFallback>
    </Avatar>
  );
}
