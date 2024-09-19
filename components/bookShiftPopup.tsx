import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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

  const shiftIsBooked = (props.shift.person1 !== "" && props.shift.person2 !== "") ? true : false;
  const shiftIsFree = (props.shift.person1 === "" && props.shift.person2 === "") ? true : false;
  const shiftIsPrivate = (props.shift.organisation === "") ? true : false;
  const shiftHasPassed = new Date(props.shift.start) < new Date();
  const userIsParticipating = (props.shift.person1 === props.user.name || props.shift.person2 === props.user.name) ? true : false;

  // Check if the user is in the organisation of the shift
  const isUserInOrganisation = (shift: Shift, user: User) => {
    for (const organisation of user.organisations) {
      if (shift.organisation === organisation.id) {
        return true;
      }
    }
  }

  // If the shift has passed and the user is not an admin, return
  if (shiftHasPassed && !props.user.isAdmin) {
    return
  }

  const header = () => {
    if (shiftHasPassed) {
      return <CardTitle className="font-normal">Detta pass har redan passerat</CardTitle>;
    }
    if (userIsParticipating) {
      return <CardTitle className="font-normal">Du jobbar detta pass</CardTitle>;
    }

    if (!shiftIsPrivate && props.shift && !isUserInOrganisation(props.shift, props.user)) {
      return <CardTitle className="font-normal">Detta pass kan inte bokas</CardTitle>;
    }

    if (shiftIsBooked) {
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
    if (shiftHasPassed) {
      return (
        <Button variant="outline" onClick={props.onCancel}>
          Tillbaka
        </Button>
      )
    }
    if (userIsParticipating) {
      return (
        <div className="flex flex-row justify-around w-full">
          <Button variant="outline" onClick={props.onCancel}>
            Avbryt
          </Button>
          <Button variant="destructive">Avboka</Button>
        </div>
      )
    }

    if (shiftIsBooked || (!shiftIsPrivate && props.shift && !isUserInOrganisation(props.shift, props.user))) {
      return (
        <Button variant="outline" onClick={props.onCancel}>
          Tillbaka
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
      <Card className={"w-4/5 sm:w-[400px] mx-auto " + (shiftHasPassed && "bg-gray-300")}>
        <CardHeader className="flex items-center text-2xl pb-2 mx-6 px-0 mb-2">
          {header()}
        </CardHeader>
        <CardContent>
          <ShiftInformation shift={props.shift} isGrayedOut={(shiftIsBooked && !userIsParticipating) || (!isUserInOrganisation(props.shift, props.user) && !shiftIsPrivate)} />
          {(!shiftHasPassed && shiftIsFree && props.user.organisations.length > 0) && (
            <Card className="mt-6 items-center rounded-md p-4 w-full">
              <p className="text-md text-muted-foreground">Jag vill jobba som</p>
              <Select>
                <SelectTrigger className="text-xl py-6 mt-1">
                  <SelectValue placeholder="Välj förening" />
                </SelectTrigger >
                <SelectContent className="text-xl">
                  {/* Render the organisations as items to select (in alphabetical order) */}
                  {props.user.organisations
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((organisation) => (
                      <SelectItem key={organisation.id} value={organisation.id}>{organisation.name}</SelectItem>
                    ))}
                  <SelectItem className="border-t" value="private">Privatist</SelectItem>
                </SelectContent>
              </Select>
            </Card>
          )}
        </CardContent>
        <CardFooter className="w-full">
          {footer()}
        </CardFooter>
      </Card>
    </div>
  )
}
