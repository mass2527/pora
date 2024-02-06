import React from "react";
import { Button, ButtonProps } from "./ui/button";
import { Loading } from "./ui/loading";
import { FormState } from "react-hook-form";

interface SubmitButton extends Omit<ButtonProps, "type" | "disabled"> {
  formState: FormState<any>;
}

export default function SubmitButton({
  formState,
  children,
  ...props
}: SubmitButton) {
  return (
    <Button
      type="submit"
      disabled={
        formState.isSubmitting || !formState.isDirty || !formState.isValid
      }
      {...props}
    >
      {formState.isSubmitting ? <Loading /> : children}
    </Button>
  );
}
