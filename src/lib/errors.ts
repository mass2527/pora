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
      case 401:
        // Prompt the user to log back in
        // showUnauthorizedDialog();
        console.info("Unauthorized");
        break;
      case 403:
        console.info("Forbidden");
        break;
      case 500:
        // Show user a dialog to apologize that we had an error and to
        // try again and if that doesn't work contact support
        // showErrorDialog();
        console.info("Internal Server Error");
        break;
      default:
        // Show
        throw new Error("Unhandled fetch response", { cause: error });
    }
  }

  throw new Error("Unknown fetch error", { cause: error });
}
