export function center(text, width) {
  const left = Math.max(0, Math.floor((width - text.length) / 2));
  return " ".repeat(left) + text;
}

export function right(text, width) {
  return text.padStart(width);
}

export function line(width, ch = "-") {
  return ch.repeat(width);
}

export function money(value) {
  return `₦${Number(value || 0).toLocaleString()}`;
}

export function truncate(text, width) {
  if (!text) return "";
  return text.length <= width
    ? text
    : text.substring(0, width - 3) + "...";
}