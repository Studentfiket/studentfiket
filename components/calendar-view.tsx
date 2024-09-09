'use client'

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import events from "../data/mochup-shifts";


function FullCalendarApp() {
  const view = "timeGridWeek";

  document.documentElement.style.setProperty('--title-font-size', "0.5em");
  if (view === "timeGridWeek") {
  }

  return (
    <div className="App">
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
        dateClick={(e) => console.log(e.dateStr)}
        eventClick={(e) => console.log(e.event.id)}
      />
    </div>
  );
}

export default FullCalendarApp;
