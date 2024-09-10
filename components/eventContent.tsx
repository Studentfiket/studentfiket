import { useEffect, useRef } from "react";
import { getShiftById } from "@/lib/pocketbase";
import { Shift } from "@/lib/types";

type Props = {
  eventId: string;
  eventTime: string;
  view: string;
}

const EventContent = (props: Props) => {
  const refContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (refContainer.current) {
      const { width, height } = refContainer.current.getBoundingClientRect();
      // console.log(width, height);

    }
  }, []);

  const shift: Shift | undefined = getShiftById(props.eventId);

  if (!shift) {
    throw new Error(`Shift ${props.eventId} not found`);
  }

  return (
    <div className='h-full py-1' ref={refContainer}>
      <p className="text-xl font-bold">{props.eventTime}</p>
      <p className="overflow-hidden mb-2">{shift.organisation}</p>
      <p>{shift.person1}</p>
      <p>{shift.person2}</p>
    </div>
  );
};

export default EventContent;