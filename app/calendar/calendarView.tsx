'use client'

import { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventContent from "@/components/eventContent";
import { Shift, User } from "@/lib/types";
import { useState } from "react";
import { Event } from "@/lib/types";
import Popup from "@/components/popup/popup";
import PocketBase, { RecordModel } from 'pocketbase';
import { getShiftRecordById } from "@/lib/scheduling";

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
    const title = `${shift.organisation}/&${shift.workers[0] ? shift.workers[0] : ""}/&${shift.workers[1] ? shift.workers[1] : ""}`;
    return {
      id: shift.id,
      title: title,
      start: shift.start,
      end: shift.end
    } as Event;
  })
}

const updateShiftCollection = (loadedShifts: Shift[], updatedShift: Shift) => {
  // Delete the old shift
  loadedShifts = loadedShifts.filter(shift => shift.id !== updatedShift.id);

  // Add the updated shift
  loadedShifts.push(updatedShift);
  return loadedShifts;
}

// Map the records from the database to the Shift type
export const mapRecordsToShifts = (records: RecordModel[]): Shift[] => {
  return records.map((record: RecordModel): Shift => ({
    id: record.id,
    organisation: record.expand?.organisation?.name || "",
    workers: record.expand?.workers?.map((worker: { name: string }) => worker.name) || [],
    start: record.startTime,
    end: record.endTime
  }));
}

//#endregion


function CalendarView(props: Props) {
  const closePopup = () => {
    setSelectedShift(null);
  }

  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [loadedShifts, setLoadedShifts] = useState(props.loadedShifts); // Store the shifts in local state
  const [events, setEvents] = useState(mapShiftsToEvents(props.loadedShifts)); // Store the events in local state

  useEffect(() => {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    pb.autoCancellation(false);

    const updateShift2 = async (e: { action: string; record: { id: string } }) => {
      console.log("Event", e);
      if (e.action === 'update') {

        // Fetch the updated record from PocketBase
        const updatedRecord = await getShiftRecordById(e.record.id);
        if (!updatedRecord) {
          console.error("Failed to fetch updated record");
          return;
        }
        console.log("Updated record", updatedRecord);

        const updatedShift = mapRecordsToShifts([updatedRecord])[0];

        // Check if the shift data has actually changed before updating state
        setLoadedShifts((prevShifts) => {
          const updatedShifts = updateShiftCollection(prevShifts, updatedShift);

          // Compare updatedShifts with prevShifts to avoid unnecessary re-renders
          const hasChanges = prevShifts.some((shift) => {
            const updated = updatedShifts.find((s) => s.id === shift.id);
            return (
              updated &&
              (shift.organisation !== updated.organisation ||
                shift.start !== updated.start ||
                shift.end !== updated.end ||
                shift.workers.length !== updated.workers.length ||
                shift.workers.some((worker, index) => worker !== updated.workers[index]))
            );
          });

          if (hasChanges) {
            console.log("Shifts updated", updatedShifts);

            if (selectedShift?.id === updatedShift.id)
              setSelectedShift(updatedShift);

            setEvents(mapShiftsToEvents(updatedShifts));
            return updatedShifts;
          }

          return prevShifts; // Don't update state if no actual changes
        });
      }
    };

    pb.collection('shifts').subscribe('*', updateShift2);

    return () => {
      pb.collection('shifts').unsubscribe();
    };
  }, [props.loadedShifts, selectedShift]);


  return (
    <div className="w-full">
      <Popup onCancel={closePopup} shift={selectedShift} user={props.user} />
      {/* <BookShiftPopup shift={selectedShift} user={props.user} onCancel={closePopup} /> */}
      <FullCalendar
        timeZone="UTC"
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
        eventClick={(e) => setSelectedShift(getShiftByIdFromCollection(e.event.id, loadedShifts))}
        eventContent={(arg) => (
          <EventContent event={arg.event} eventTime={arg.timeText} />
        )}
      />
    </div>
  );
}

export default CalendarView;
