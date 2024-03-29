import { User } from "@prisma/client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserAvatar({
  user,
  className,
}: {
  user: Pick<User, "name" | "image">;
  className?: string;
}) {
  const lastName = user.name?.split(" ")[1];

  return (
    <Avatar className={className}>
      {user.image && <AvatarImage src={user.image} />}
      <AvatarFallback>{lastName}</AvatarFallback>
    </Avatar>
  );
}
