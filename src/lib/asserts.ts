import { getUser } from "./auth";
import { invariant } from "./utils";

export function assertAuthenticated(
  user: Awaited<ReturnType<typeof getUser>>
): asserts user {
  invariant(user, "Authentication has already been verified by the middleware");
}
