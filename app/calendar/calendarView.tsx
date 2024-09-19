'use client'

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventContent from "@/components/eventContent";
import { Shift, User } from "@/lib/types";
import BookShiftPopup from "@/components/bookShiftPopup";
import { useState } from "react";
import { Event } from "@/lib/types";

type Props = {
  loadedShifts: Shift[];
  user: User;
}

//#region Event functions
const getShiftByIdFromCollection = (id: string, shiftCollection: Shift[] = []) => {
  const shift = shiftCollection.find(shift => shift.id === id);
  if (!shift)
    return null;
  return shift;
}

const mapShiftsToEvents = (shifts: Shift[]): Event[] => {
  // Map the shifts to events, combining the organisation and workers information into the title
  return shifts.map(shift => {
    const title = `${shift.organisation}/&${shift.person1}/&${shift.person2}`;
    return {
      id: shift.id,
      title: title,
      start: shift.start,
      end: shift.end
    } as Event;
  })
}

//#endregion


function CalendarView(props: Props) {
  const closePopup = () => {
    setSelectedShift(null);
  }

  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const events = mapShiftsToEvents(props.loadedShifts);

  return (
    <div className="w-screen">
      <BookShiftPopup shift={selectedShift} user={props.user} onCancel={closePopup} />
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        eventTimeFormat={{ hour: "2-digit", minute: "2-digit", meridiem: false, hour12: false }}
        slotLabelFormat={{ hour: "2-digit", minute: "2-digit", meridiem: false, hour12: false }}
        headerToolbar={{
          left: "timeGridWeek,timeGridDay",
          right: "prev,next",
        }}
        weekends={false}
        displayEventEnd={false}
        events={events}
        height="90vh"
        slotDuration={"01:00:00"}
        expandRows={true}
        validRange={
          props.user?.isAdmin ? {} :
            {
              start: new Date().toISOString().split('T')[0]
            }
        }
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        allDaySlot={false}
        navLinkDayClick={(e) => console.log(e)}
        eventClick={(e) => setSelectedShift(getShiftByIdFromCollection(e.event.id, props.loadedShifts))}
        eventContent={(arg) => (
          <EventContent event={arg.event} eventTime={arg.timeText} />
        )}
      />
    </div>
  );
}

export default CalendarView;
