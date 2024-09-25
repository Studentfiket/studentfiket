export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  organisations: Organisation[];
  isAdmin: boolean;
}
export interface Organisation {
  id: string;
  name: string;
  nrOfShifts: number;
}
export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
}
export interface Shift {
  id: string;
  organisation: string;
  workers: string[];
  start: string;
  end: string;
}