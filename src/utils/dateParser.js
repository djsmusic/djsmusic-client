// @flow

export default function parseDate(date?: Date | Array<number>): ?Date {
  if (!date) {
    return null;
  }
  if (Array.isArray(date)) {
    return new Date(Date.UTC(
      date[0], // year
      date[1] - 1, // month
      date[2], // day
      date[3], // hour
      date[4], // minute
      date[5], // second
    ));
  }

  return date;
}
