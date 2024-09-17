import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, Shift } from "@/lib/types";
import ShiftInformation from "./shiftInformation";
import { CalendarHeart } from "lucide-react"

type Props = {
  shift: Shift | null;
  user: User;
  onCancel: () => void;
}

export default function bookShiftPopup(props: Props) {
  // Close the popup when clicking outside of the details panel
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Makes sure the onCancel() is only called when clicking the element thats bound to the onClick (the gray area).
    if (event.target !== event.currentTarget) {
      return;
    }
    props.onCancel();
  }

  if (!props.shift) {
    return
  }

  const isBooked = (props.shift.person1 !== "" && props.shift.person2 !== "") ? true : false;
  const isReserved = (props.shift.person1 !== "" || props.shift.person2 !== "") ? true : false;

  if (isBooked) {
    return null;
  }

  return (
    <div onClick={handleClick} className="absolute top-0 left-0 w-screen h-screen z-20 grid grid-cols-1 content-center justify-center bg-[rgba(0,0,0,0.4)]">
      <Card className="w-4/5 sm:w-[400px] mx-auto">
        <CardHeader className="flex flex-row items-center text-2xl pb-2 mx-6 px-0 mb-2">
          <CalendarHeart className="h-full mt-1 mr-2" />
          <CardTitle className="font-normal">Boka Pass</CardTitle>
        </CardHeader>
        <CardContent>
          <ShiftInformation shift={props.shift} />
          {props.user.organisations[0].name}

        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={props.onCancel}>Avbryt</Button>
          <Button>Boka</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
