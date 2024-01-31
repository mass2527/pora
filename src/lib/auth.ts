import { sleep } from "./utils";

export const user = {
  id: "81a963a2-c3dc-4364-b377-c1000f2d14c8",
  username: "philly",
};

export async function getCurrentUser() {
  await sleep(500);

  return Math.random() < 0.99 ? user : null;
}
