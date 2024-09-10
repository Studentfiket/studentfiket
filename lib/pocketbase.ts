// TODO: Implement the pocketbase :)
import placeholderShifts from "@/data/mockup-shifts";
import { Shift } from "./types";

// Check if the shift is booked, reserved or free
const checkAvailability = (shift: Shift) => {
  if (shift.organisation !== "") {
    if (shift.person1 !== "" && shift.person2 !== "") {
      return "booked";
    } else {
      return "reserved";
    }
  } else {
    return "free";
  }
}

export const getCurrentShifts = () => {
  return placeholderShifts;
}

export const getCurrentShiftsAsEventSources = () => {

  return placeholderShifts.map(shift => {
    return {
      id: shift.id,
      start: shift.start,
      end: shift.end,
      classNames: [checkAvailability(shift) + "-shift"]
    }
  });
}

export const getShiftById = (id: string) => {
  return placeholderShifts.find(shift => shift.id === id);
}