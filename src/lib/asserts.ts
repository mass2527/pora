import { getUser } from "./auth";
import { assert } from "./utils";

export function assertAuthenticated(
  user: Awaited<ReturnType<typeof getUser>>
): asserts user {
  assert(user, "Authentication has already been verified by the middleware");
}
