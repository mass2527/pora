import React from "react";
import { Button, ButtonProps } from "./ui/button";
import { Loading } from "./ui/loading";
import { FormState } from "react-hook-form";

interface SubmitButtonProps extends Omit<ButtonProps, "type" | "disabled"> {
  formState: FormState<any>;
}

export default function FormSubmitButton({
  formState,
  children,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={formState.isSubmitting} {...props}>
      {formState.isSubmitting ? <Loading /> : children}
    </Button>
  );
}
