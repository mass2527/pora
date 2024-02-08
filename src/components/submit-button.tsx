import React from "react";
import { Button, ButtonProps } from "./ui/button";
import { Loading } from "./ui/loading";
import { FormState } from "react-hook-form";

interface SubmitButton extends Omit<ButtonProps, "type" | "disabled"> {
  formState: FormState<any>;
  allowNoChange?: boolean;
}

export default function SubmitButton({
  formState,
  allowNoChange = false,
  children,
  ...props
}: SubmitButton) {
  return (
    <Button
      type="submit"
      disabled={
        formState.isSubmitting ||
        !formState.isValid ||
        (allowNoChange ? false : !formState.isDirty)
      }
      {...props}
    >
      {formState.isSubmitting ? <Loading /> : children}
    </Button>
  );
}
