// Checks if the user is allowed to cancel the shift (over 3 days before the shift)
export const isCancellationAllowed = (shiftStartTime: string): boolean => {
  const MIN_DAYS_TO_CANCEL = 3;
  const shiftStartDate = new Date(shiftStartTime);
  const cancelLimit = new Date();
  cancelLimit.setDate(cancelLimit.getDate() + MIN_DAYS_TO_CANCEL);
  console.log('shiftStartDate: ', shiftStartDate.toISOString(), 'cancelWindow: ', cancelLimit.toISOString());
  return shiftStartDate >= cancelLimit;
}