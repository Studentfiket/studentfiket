import { Shift } from "@/lib/types";
import { getDateDay, getMonth, getWeekday } from "@/functions/shiftFunctions"
import { Card } from "./ui/card";
import { Clock } from "lucide-react";

type Props = {
  shift: Shift;
}

export default function ShiftInformation(props: Props) {
  const shiftDateStart = new Date(props.shift.start);
  const shiftDateEnd = new Date(props.shift.end);

  return (
    <Card className="flex items-center space-x-4 rounded-md p-4 w-full">
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex flex-col w-full">
          <p className="text-md text-muted-foreground">{getWeekday(shiftDateStart)} {getDateDay(shiftDateStart)} {getMonth(shiftDateStart, false)}</p>
          <p className="text-4xl font-light">{shiftDateStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {shiftDateEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        {props.shift.organisation !== "" &&
          <div className="border-b pt-2">
            <p className="text-md text-muted-foreground">Bokad av <span className="font-bold">3Cant</span> med</p>
            <p className="text-4xl font-light">Ivar Gavelin</p>
          </div>
        }
      </div>
    </Card>
  );

}