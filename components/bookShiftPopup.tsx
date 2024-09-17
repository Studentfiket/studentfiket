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
import { Shift } from "@/lib/types";
import ShiftInformation from "./shiftInformation";
import { CalendarHeart } from "lucide-react"

type Props = {
  shift: Shift | null;
  onCancel: () => void;
}

export default function bookShiftPopup(props: Props) {
  if (!props.shift) {
    return
  }

  return (
    <div className="absolute top-0 left-0 w-screen h-screen z-20 grid grid-cols-1 content-center justify-center bg-[rgba(0,0,0,0.4)]">
      <Card className="w-4/5 sm:w-[400px] mx-auto">
        <CardHeader className="flex flex-row items-center text-2xl pb-2 mx-6 px-0 mb-2">
          <CalendarHeart className="h-full mt-1 mr-2" />
          <CardTitle className="font-normal">Boka Pass</CardTitle>
        </CardHeader>
        <CardContent>
          <ShiftInformation shift={props.shift} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={props.onCancel}>Avbryt</Button>
          <Button>Boka</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
