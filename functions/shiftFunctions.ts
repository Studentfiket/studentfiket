export const getWeekday = (date: Date) => {
  const days = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
  return days[date.getDay()];
}

// Returns the day of the month
export const getDateDay = (date: Date) => {
  const day = date.getDate();
  switch (day) {
    case 1:
    case 21:
    case 31:
      return `${day}a`;
    case 2:
    case 22:
      return `${day}a`;
    case 3:
    case 23:
      return `${day}e`;
    default:
      return `${day}e`;
  }
}