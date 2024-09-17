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
  const isPrivate = (props.shift.organisation === "" && !isBooked) ? true : false;
  const isUser = (props.shift.person1 === props.user.name || props.shift.person2 === props.user.name) ? true : false;

  // Check if the user is in the organisation of the shift
  const isUserInOrganisation = (shift: Shift, user: User) => {
    for (const organisation of user.organisations) {
      if (shift.organisation === organisation.id) {
        return true;
      }
    }
  }

  const header = () => {
    if (isUser) {
      return <CardTitle className="font-normal">Du jobbar detta pass</CardTitle>;
    }

    if (!isPrivate && props.shift && !isUserInOrganisation(props.shift, props.user)) {
      return <CardTitle className="font-normal">Detta pass kan inte bokas</CardTitle>;
    }

    if (isBooked) {
      return <CardTitle className="font-normal">Detta pass är bokat</CardTitle>;
    }

    return (
      <div className="flex items-center">
        <CalendarHeart className="h-full mt-1 mr-2" />
        <CardTitle className="font-normal">Boka Pass</CardTitle>
      </div>
    );
  };

  const footer = () => {
    if (isUser) {
      return (
        <div className="flex flex-row justify-around w-full">
          <Button variant="outline" onClick={props.onCancel}>
            Avbryt
          </Button>
          <Button variant="destructive">Avboka</Button>
        </div>
      )
    }

    if (isBooked || (!isPrivate && props.shift && !isUserInOrganisation(props.shift, props.user))) {
      return (
        <Button variant="outline" onClick={props.onCancel}>
          Avbryt
        </Button>
      )
    }

    return (
      <div className="flex flex-row justify-around w-full">
        <Button variant="outline" onClick={props.onCancel}>
          Avbryt
        </Button>
        <Button>Boka</Button>
      </div>
    )
  }

  // TODO: Add the ability to select organisation
  return (
    <div onClick={handleClick} className="absolute inset-0 w-screen h-screen z-20 grid place-items-center bg-[rgba(0,0,0,0.4)]">
      <Card className="w-4/5 sm:w-[400px] mx-auto">
        <CardHeader className="flex items-center text-2xl pb-2 mx-6 px-0 mb-2">
          {header()}
        </CardHeader>
        <CardContent>
          <ShiftInformation shift={props.shift} isGrayedOut={isBooked || (!isUserInOrganisation(props.shift, props.user) && !isPrivate)} />
        </CardContent>
        <CardFooter className="w-full">
          {footer()}
        </CardFooter>
      </Card>
    </div>
  )
}
