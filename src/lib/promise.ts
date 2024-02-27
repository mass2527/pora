import { notFound } from "next/navigation";

export async function ifNullable<T>(
  promise: Promise<T>,
  onNullable: () => never
) {
  const data = await promise;
  if (!data) {
    onNullable();
  }

  return data;
}

export function renderNotFoundIfNullable<T>(promise: Promise<T>) {
  return ifNullable(promise, () => notFound());
}
