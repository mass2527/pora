export function debounce<T extends (...args: any[]) => any>(
  callback: T,
  timeout: number
) {
  let timeoutId: number | null = null;

  return (...args: any[]) => {
    if (timeoutId) {
      clearInterval(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, timeout);
  };
}
