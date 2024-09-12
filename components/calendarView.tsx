'use client'

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventContent from "@/components/eventContent";
import { Shift } from "@/lib/types";

const shiftsAsEventSources = (shifts: Shift[]) => {
  return shifts.map(shift => {
    return {
      id: shift.id,
      start: shift.start,
      end: shift.end,
      classNames: [checkAvailability(shift) + "-shift"]
    }
  });
}

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

type Props = {
  loadedShifts: Shift[];
}

function CalendarView(props: Props) {
  const events = shiftsAsEventSources(props.loadedShifts);
  const view = "timeGridWeek";
  console.log(events);

  return (
    <div className="App">
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
          eventColor="green"
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
          dateClick={(e) => console.log(e.dateStr)}
          eventClick={(e) => console.log(e.event.id)}
          eventContent={(arg) => (
            <EventContent eventId={arg.event.id} eventTime={arg.timeText} view={view} />
          )}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CalendarView;
