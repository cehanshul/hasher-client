// utils/debounce.ts

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...funcArgs: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null;

  return function (...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}