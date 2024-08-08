export function formatDate(customDate: Date): string {
  const year = customDate.getFullYear();
  const month = String(customDate.getMonth() + 1).padStart(2, '0');
  const day = String(customDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}