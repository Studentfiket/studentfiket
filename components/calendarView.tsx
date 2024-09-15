'use client'

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventContent from "@/components/eventContent";
import { Shift, Event } from "@/lib/types";
import { Alert } from "@/components/ui/alert";
import { getUser } from "@/lib/pocketbase";
import { useState, useEffect } from 'react'

const shiftsAsEventSources = async (shifts: Shift[]): Promise<Event[]> => {
  // Map the shifts to events, combining the organisation and workers information into the title
  return Promise.all(shifts.map(async shift => {
    const person1 = shift.person1 ? await getUser(shift.person1).then(user => user?.name) : "";
    const person2 = shift.person2 ? await getUser(shift.person2).then(user => user?.name) : "";

    return {
      id: shift.id,
      start: shift.start,
      end: shift.end,
      title: shift.organisation + "/&" + person1 + "/&" + person2
    }
  }));
}

type Props = {
  loadedShifts: Shift[] | undefined;
}

function CalendarView(props: Props) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      if (props.loadedShifts) {
        const events = await shiftsAsEventSources(props.loadedShifts);
        setEvents(events);
      }
    }
    fetchPosts()
  }, [props.loadedShifts])

  // if (!props.loadedShifts) {
  //   return <Alert className="m-10 w-auto font-semibold" variant={"destructive"}>Error <br />No shifts found</Alert>;
  // }

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
          eventClick={(e) => console.log(e.event.id)}
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
