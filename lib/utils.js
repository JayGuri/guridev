// Merge class names, filtering out falsy values (lightweight clsx alternative)
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
