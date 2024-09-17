import { Shift } from "@/lib/types";
import { getDateDay, getMonth, getWeekday } from "@/functions/shiftFunctions"
import { Card } from "./ui/card";

type Props = {
  shift: Shift;
  isGrayedOut?: boolean;
}

export default function ShiftInformation(props: Props) {
  const shiftDateStart = new Date(props.shift.start);
  const shiftDateEnd = new Date(props.shift.end);

  const isFree = props.shift.organisation === "" && props.shift.person1 === "" && props.shift.person2 === "";
  const isPrivate = props.shift.organisation === "" && !isFree;

  return (
    <Card className={`flex items-center space-x-4 rounded-md p-4 w-full ${props.isGrayedOut && "bg-red-100"} `}>
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex flex-col w-full">
          <p className="text-md text-muted-foreground">{getWeekday(shiftDateStart)} {getDateDay(shiftDateStart)} {getMonth(shiftDateStart, false)}</p>
          <p className="text-4xl font-light">
            {shiftDateStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            &nbsp;-&nbsp;
            {shiftDateEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </p>
        </div>
        {!isFree &&
          <div className="border-t pt-2">
            <p className="text-md text-muted-foreground">Detta pass jobbar</p>
            <p className="text-4xl font-light">{props.shift.person1}</p>
            <p className="text-4xl font-light">{props.shift.person2}</p>
            {!isPrivate && <p className="text-muted-foreground">från <span className="font-bold">{props.shift.organisation}</span></p>}
          </div>
        }
      </div>
    </Card>
  );

}