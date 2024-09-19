import { Shift } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CalendarHeart } from "lucide-react"
import ShiftInformation from "../shiftInformation";

type Props = {
  shift: Shift | null;
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
          <CalendarHeart className="h-full mt-1 mr-2" />
          <CardTitle className="font-normal">Tack för din bokning!</CardTitle>
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