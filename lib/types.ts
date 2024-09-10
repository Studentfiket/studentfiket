export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  className: string;
  editable: boolean;
}
export interface Shift {
  id: string;
  organisation: string;
  person1: string;
  person2: string;
  start: string;
  end: string;
}