export default async function Await<T>({
  promise,
  children,
}: {
  promise: Promise<T>;
  // eslint-disable-next-line unused-imports/no-unused-vars
  children: (data: T) => JSX.Element;
}) {
  const data = await promise;

  return children(data);
}
