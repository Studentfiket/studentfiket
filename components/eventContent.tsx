import { Shift } from "@/lib/types";
import { EventApi } from "@fullcalendar/react";

type Props = {
  event: EventApi;
  eventTime: string;
}

const EventContent = (props: Props) => {
  const interactiveClass = "shadow-lg";
  const bookedClass = "bg-shift-booked opacity-30 shadow-inner"

  // Generate the title of the shift (Organisation name, Private or Book)
  const getTitle = (shift: Shift) => {
    if (shift.organisation !== "") {
      // If the shift is booked by an organisation, return the organisation name
      return shift.organisation;
    }
    if (shiftHasPassed && shift.person1 === "" && shift.person2 === "") {
      // If the shift has passed and was free, return "Obokat"
      return "Obokat";
    }
    if (shift.person1 !== "" || shift.person2 !== "") {
      // If the shift i booked by a person but no organisation, return "Privat"
      return "Privat";
    }
    // If the shift is free, return "BOKA"
    return "BOKA";
  }

  // Check if the shift is booked, reserved or free. Used to determine the styling of the shift
  const checkAvailability = (shift: Shift) => {
    const shiftTitle = getTitle(shift);
    switch (shiftTitle) {
      case "Privat":
        return (shift.person1 !== "" && shift.person2 !== "") ? bookedClass : "bg-shift-reserved " + interactiveClass;
      case "BOKA":
        return "bg-shift-free " + interactiveClass;
      default:
        return (shift.person1 !== "" && shift.person2 !== "") ? bookedClass : "bg-shift-reserved " + interactiveClass;
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

  const shortName1 = shift.person1 !== "" ? (shift.person1.split(" ")[0] + " " + shift.person1.split(" ")[1].charAt(0) + ".") : "";
  const shortName2 = shift.person2 !== "" ? (shift.person2.split(" ")[0] + " " + shift.person2.split(" ")[1].charAt(0) + ".") : "";

  const startHour = new Date(props.event.startStr).getHours();
  const shiftHasPassed = new Date(props.event.startStr) < new Date();

  return (
    <div className={'event-container w-auto box-content h-full py-1 overflow-hidden rounded-lg cursor-pointer ' +
      'sm:ml-1 sm:mr-2 hover:scale-105 transition-transform ease-in-out ' + checkAvailability(shift) + (shiftHasPassed && ' grayscale')}>
      <div className="h-full grid grid-rows-2">
        <div>
          <div>
            <p>{props.eventTime}</p>
            <h3>{getTitle(shift)}</h3>
          </div>
        </div>
        {startHour !== 12 && (
          <div>
            <p className="hidden sm:block">{shift.person1}</p>
            <p className="block sm:hidden">{shortName1}</p>
            <p className="hidden sm:block">{shift.person2}</p>
            <p className="block sm:hidden">{shortName2}</p>
          </div>
        )}
      </div>
    </div >
  );
};

export default EventContent;