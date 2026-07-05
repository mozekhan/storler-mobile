export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ');
}

export function cx(...classes) {
  return classes
    .filter(Boolean)
    .join(' ');
}

export function clsx(...classes) {
  return classes
    .filter(Boolean)
    .join(' ');
}

export default {
  cn,
  cx,
  clsx,
};