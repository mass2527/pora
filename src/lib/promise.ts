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
