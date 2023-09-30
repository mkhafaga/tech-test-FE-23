import moment from "moment";
/**
 * Implement a helper function that takes an iso formatted date string and returns a formatted date string.
 */
export const formatDateAndTime = (date: string): string => {
  return moment(date).format("ddd, MMM D, hh:mm ");
};
