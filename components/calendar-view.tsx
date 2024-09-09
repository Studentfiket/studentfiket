'use client'

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";


function FullCalendarApp() {
  return (
    <div className="App">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        // initialView="basicWeek"
        headerToolbar={{
          center: "dayGridMonth,timeGridWeek,timeGridDay new"
        }}
        customButtons={{
          new: {
            text: "new",
            click: () => console.log("new event")
          }
        }}
        events={[
          {
            id: "1",
            title: "event 1",
            start: "2024-09-14T10:00:00",
            end: "2024-09-14T12:00:00"
          },
          {
            id: "2",
            title: "event 2",
            start: "2024-09-14T13:00:00",
            end: "2024-09-14T18:00:00"
          }
        ]}
        eventColor="red"
        nowIndicator
        dateClick={(e) => console.log(e.dateStr)}
        eventClick={(e) => console.log(e.event.id)}
      />
    </div>
  );
}

export default FullCalendarApp;
