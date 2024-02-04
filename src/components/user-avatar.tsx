import { User } from "@prisma/client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserAvatar({ user }: { user: User }) {
  const lastName = user.name?.split(" ")[1];

  return (
    <Avatar>
      <AvatarImage src={user.image ?? undefined} />
      <AvatarFallback>{lastName}</AvatarFallback>
    </Avatar>
  );
}
