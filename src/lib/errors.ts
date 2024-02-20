import { toast } from "sonner";
import { ServerActionResponse } from "~/types";

export function throwServerError(
  response: Extract<ServerActionResponse, { status: "failure" }>
): never {
  throw new ServerError(response.error.message, {
    status: response.error.status,
    data: response.error.data,
  });
}

export class ServerError<T> extends Error {
  status: number;
  data?: T;

  constructor(message: string, { status, data }: { status: number; data?: T }) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export function handleError(error: unknown) {
  console.error(error);

  if (error instanceof ServerError) {
    switch (error.status) {
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
