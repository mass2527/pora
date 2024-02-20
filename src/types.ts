export type ServerActionResponse<T = unknown> =
  | {
      status: "success";
      data: T;
    }
  | {
      status: "failure";
      error: {
        message: string;
        status: number;
        data?: unknown;
      };
    };
