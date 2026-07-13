export function getInitials(fullName) {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export function abbreviate(text) {
  if (!text) return '';
  return text
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}
