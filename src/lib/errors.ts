import { toast } from "sonner";

export class ResponseError extends Error {
  response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.response = response;
  }
}

export function handleError(error: unknown) {
  console.error(error);

  if (error instanceof ResponseError) {
    switch (error.response.status) {
      case 401: {
        toast.error("로그인 후 다시 시도해 주세요.");
        return;
      }
      case 500: {
        toast.error("오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
        return;
      }
      default: {
        console.error("Unhandled fetch response", { error });
        return;
      }
    }
  }

  console.error("Unknown error", { error });
}
