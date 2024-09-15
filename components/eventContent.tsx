import { Shift } from "@/lib/types";
import { EventApi } from "@fullcalendar/react";

type Props = {
  event: EventApi
  eventTime: string;
}

const EventContent = (props: Props) => {
  const interactiveClass = "shadow-lg cursor-pointer hover:scale-105 transition-transform ease-in-out";
  const notInteractiveClass = "bg-shift-booked opacity-30 shadow-inner cursor-default"

  // Generate the title of the shift (Organisation name, Private or Book)
  const getTitle = (shift: Shift) => {
    if (shift.organisation !== "") {
      return shift.organisation;
    }
    else {
      if (shift.person1 !== "") {
        return "Privat";
      }
      return "BOKA";
    }
  }

  // Check if the shift is booked, reserved or free. Used to determine the styling of the shift
  const checkAvailability = (shift: Shift) => {
    const shiftTitle = getTitle(shift);
    switch (shiftTitle) {
      case "Privat":
        return (shift.person1 !== "" && shift.person2 !== "") ? notInteractiveClass : "bg-shift-reserved " + interactiveClass;
      case "BOKA":
        return "bg-shift-free " + interactiveClass;
      default:
        return (shift.person1 !== "" && shift.person2 !== "") ? notInteractiveClass : "bg-shift-reserved " + interactiveClass;
    }
  }

  // Split the information from the event title into separate fields
  const shiftInfo = props.event.title.split("/&");
  const shift: Shift = {
    id: props.event.id,
    organisation: shiftInfo[0],
    person1: shiftInfo[1],
    person2: shiftInfo[2],
    start: props.event.startStr,
    end: props.event.endStr
  }

  return (
    <div className={'event-container w-full h-full py-1 overflow-hidden rounded-lg ' + checkAvailability(shift)}>
      <div className="grid">
        <div>
          <h2 className="text-sm">{props.eventTime}</h2>
          <h3>{getTitle(shift)}</h3>
        </div>
        <div>
          <p>{shift.person1}</p>
          <p>{shift.person2}</p>
        </div>
      </div>
    </div>
  );
};

export default EventContent;