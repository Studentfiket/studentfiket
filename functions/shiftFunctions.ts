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

// Returns the month of the year
export const getMonth = (date: Date, startOnUppercase: boolean = true) => {
  const months = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
  if (startOnUppercase) {
    return months[date.getMonth()].charAt(0).toUpperCase() + months[date.getMonth()].slice(1);
  }
  return months[date.getMonth()];
}