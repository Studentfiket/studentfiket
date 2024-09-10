import { getShiftById } from "@/lib/pocketbase";
import { Shift } from "@/lib/types";

type Props = {
  eventId: string;
  eventTime: string;
  view: string;
}

const EventContent = (props: Props) => {
  const shift: Shift | undefined = getShiftById(props.eventId);

  if (!shift) {
    throw new Error(`Shift ${props.eventId} not found`);
  }

  return (
    <div className='h-full py-1'>
      <p className="text-xl font-bold">{props.eventTime}</p>
      <p className="overflow-hidden">{shift.organisation}</p>
    </div>
  );
};

export default EventContent;