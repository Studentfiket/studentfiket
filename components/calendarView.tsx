'use client'

import { Calendar } from "fullcalendar";
import FullCalendar, { EventSourceInput } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventContent from "@/components/eventContent";
import { getCurrentShiftsAsEventSources } from "@/lib/pocketbase";
import { useEffect, useState, useRef } from "react";


function FullCalendarApp() {
  const calendarRef = useRef<FullCalendar | null>(null);

  useEffect(() => {
    // const weekButton = document.getElementsByClassName('fc-timeGridWeek-button')[0];
    // weekButton.addEventListener('click', () => {
    //   console.log('Week button clicked');
    // });
    // const dayButton = document.getElementsByClassName('fc-timeGridDay-button')[0];
    // weekButton.addEventListener('click', () => {
    //   console.log('Day button clicked');
    // });
    const calendarEl = document.getElementsByClassName('fc')[0];
    if (!calendarEl) {
      throw new Error('Calendar element not found');
    }
    const calendar = new Calendar(calendarEl as HTMLElement, {
      initialView: 'dayGridMonth'
    });
    console.log(calendar);
  }, []);


  const events: EventSourceInput = getCurrentShiftsAsEventSources();
  const view = "timeGridWeek";

  return (
    <div className="App">
      <FullCalendar
        ref={calendarRef}
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
    </div>
  );
}

export default FullCalendarApp;
