import React, { ReactNode } from "react";
import {
  Card as CardComponent,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function Card({
  title,
  description,
  content,
  footer,
}: {
  title: string;
  description?: string;
  content: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <CardComponent>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{content}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </CardComponent>
  );
}
