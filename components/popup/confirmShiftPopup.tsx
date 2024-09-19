import { Shift } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Heart, CalendarMinus } from "lucide-react"
import ShiftInformation from "../shiftInformation";

type Props = {
  shift: Shift | null;
  userIsBooking: boolean;
  onCancel: () => void;
}

export default function ConfirmShiftPopup(props: Props) {
  if (!props.shift) {
    return null;
  }

  return (
    <div>
      <CardHeader className="flex items-center text-2xl pb-2 mx-6 px-0 mb-2">
        <div className="flex items-center">
          {props.userIsBooking ? <Heart className="h-full mr-2" /> : <CalendarMinus className="h-full mr-2" />}
          <CardTitle className="font-normal">
            {props.userIsBooking ? "Tack för din bokning!" : "Du har avbokat ditt pass"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ShiftInformation shift={props.shift} isGrayedOut={false} />
      </CardContent>
      <CardFooter className="w-full">
        <Button variant="outline" onClick={props.onCancel}>
          Tillbaka
        </Button>
      </CardFooter>
    </div>
  );
}