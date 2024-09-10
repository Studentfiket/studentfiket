'use client'

import FullCalendar, { CalendarApi, EventSourceInput } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventContent from "@/components/eventContent";
import { getCurrentShiftsAsEventSources } from "@/lib/pocketbase";


function FullCalendarApp() {
  const events: EventSourceInput = getCurrentShiftsAsEventSources();
  const view = "day"

  return (
    <div className="App">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        eventTimeFormat={{ hour: "2-digit", minute: "2-digit", meridiem: false, hour12: false }}
        slotLabelFormat={{ hour: "2-digit", minute: "2-digit", meridiem: false, hour12: false }}
        customButtons={{
          myCustomButton: {
            text: 'custom!',
            click: function () {
              alert('clicked the custom button!');
            }
          }
        }}
        headerToolbar={{
          left: "timeGridWeek,timeGridDay, myCustomButton",
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
        dateClick={(e) => console.log(e.dateStr)}
        eventClick={(e) => console.log(e.event.id)}
        eventContent={(arg) => (
          <EventContent eventId={arg.event.id} eventTime={arg.timeText} view={view} />
        )}
      />
    </div>
  );
}

export default FullCalendarApp;
