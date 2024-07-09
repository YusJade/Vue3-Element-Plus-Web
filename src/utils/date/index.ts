export function formatDate(date: Date) {
  const year = date.getFullYear
  const month = date.getMonth
  const day = date.getDay

  return `${year}Äê${month}ÔÂ${day}ÈÕ`
}