import { Shift } from "@/lib/types";

// Checks if the user is allowed to cancel the shift (over 3 days before the shift)
export const isCancellationAllowed = (shiftStartTime: string): boolean => {
  const MIN_DAYS_TO_CANCEL = 3;
  const shiftStartDate = new Date(shiftStartTime);
  const cancelLimit = new Date();
  cancelLimit.setDate(cancelLimit.getDate() + MIN_DAYS_TO_CANCEL);
  console.log('shiftStartDate: ', shiftStartDate.toISOString(), 'cancelWindow: ', cancelLimit.toISOString());
  return shiftStartDate >= cancelLimit;
}

// Checks the number of lunch shifts in a collection. Return the number of lunch shifts with a 0.5 multiplier (counts as half a shift)
export const getLunchShifts = (shifts: Shift[]): number => {
  return shifts.filter(shift => shift.start.includes("12:00")).length * 0.5;
}