'use client'

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventContent from "@/components/eventContent";
import { Shift, Event } from "@/lib/types";
import BookShiftPopup from "@/components/bookShiftPopup";
import { useState } from "react";

const shiftsAsEventSources = (shifts: Shift[]): Event[] => {
  // Map the shifts to events, combining the organisation and workers information into the title
  return shifts.map(shift => {
    const title = `${shift.organisation}/&${shift.person1}/&${shift.person2}`;
    return {
      id: shift.id,
      title: title,
      start: shift.start,
      end: shift.end
    }
  })
}

type Props = {
  loadedShifts: Shift[] | undefined;
}

function CalendarView(props: Props) {
  const getShiftById = (id: string): Shift | null => {
    const shift = props.loadedShifts?.find(shift => shift.id === id);
    if (!shift) {
      return null;
    }
    return shift;
  }

  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  if (!props.loadedShifts) {
    return <p>Loading...</p>;
  }
  const events = shiftsAsEventSources(props.loadedShifts);

  return (
    <div className="w-screen">
      <BookShiftPopup shift={selectedShift} />
      {events.length > 0 ? (
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
            {
              start: new Date().toISOString().split('T')[0]
            }
          }
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          allDaySlot={false}
          navLinkDayClick={(e) => console.log(e)}
          eventClick={(e) => setSelectedShift(getShiftById(e.event.id))}
          eventContent={(arg) => (
            <EventContent event={arg.event} eventTime={arg.timeText} />
          )}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CalendarView;
