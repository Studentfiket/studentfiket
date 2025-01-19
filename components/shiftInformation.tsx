import { Shift } from "@/lib/types";
import { getDateDay, getMonth, getWeekday } from "@/functions/shiftFunctions"
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

type Props = {
  shift: Shift;
  isGrayedOut?: boolean;
  isLoading?: boolean;
}

export default function ShiftInformation(props: Props) {
  const shiftDateStart = new Date(props.shift.start);
  const shiftDateEnd = new Date(props.shift.end);
  const shiftHasPassed = new Date() > shiftDateEnd;

  const isFree = props.shift.organisation === "" && props.shift.workers[0] === undefined && props.shift.workers[1] === undefined;
  const isPrivate = props.shift.organisation === "" && !isFree;

  const loader = () => {
    return (
      <div className="w-full h-full bg-card flex items-center absolute top-0 left-0 rounded-md">
        <div className="w-fit m-auto opacity-80">
          <div className="loader">
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`flex items-center space-x-4 rounded-md p-4 w-full relative ${props.isGrayedOut && "bg-red-100"}`}>
      {props.isLoading && loader()}
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex flex-col w-full">
          <p className="text-md text-muted-foreground">{getWeekday(shiftDateStart)} {getDateDay(shiftDateStart)} {getMonth(shiftDateStart, false)}</p>
          <p className="sm:text-4xl text-3xl font-light">
            {shiftDateStart.toISOString().substring(11, 16)}
            &nbsp;-&nbsp;
            {shiftDateEnd.toISOString().substring(11, 16)}
          </p>
        </div>

        {!isFree &&
          <div>
            <Separator className="mb-2 " />
            <p className="text-md text-muted-foreground">Detta pass {shiftHasPassed ? "jobbade" : "jobbar"}</p>
            <p className="text-4xl font-light">{props.shift.workers[0]}</p>
            <p className="text-4xl font-light">{props.shift.workers[1]}</p>
            {!isPrivate && <p className="text-muted-foreground">från <span className="font-bold">{props.shift.organisation}</span></p>}
          </div>
        }
      </div>
    </Card>
  );

}