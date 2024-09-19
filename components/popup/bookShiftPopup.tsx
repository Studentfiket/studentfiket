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
import ShiftInformation from "../shiftInformation";
import { CalendarHeart } from "lucide-react"
import { useState } from "react";
import { updateShift } from "@/lib/scheduling";

type Props = {
  shift: Shift | null;
  user: User;
  onCancel: () => void;
  setConfirmBooking: (value: boolean) => void;
}

export default function BookShiftPopup(props: Props) {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (props.shift)
        updateShift(props.shift.id, props.user, organisationId, userIsBooking);
    } catch (error) {
      console.error(error);
    }

  }

  const [organisationId, setOrganisationId] = useState<string>('');
  const [userIsBooking, setUserIsBooking] = useState<boolean>(true);

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
      if (shift.organisation === organisation.name) {
        return true;
      }
    }
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
      // If the user is participating, show a cancel button
      // and set userIsBooking to false when the user cancels
      userIsBooking && setUserIsBooking(false);
      return (
        <div className="flex flex-row justify-around w-full">
          <Button variant="outline" onClick={props.onCancel}>
            Avbryt
          </Button>
          <Button variant="destructive" type="submit">Avboka</Button>
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
        <input type="hidden" name="shift-action" value="book-shift" />
        <Button type="submit">Boka</Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className={(shiftHasPassed ? "bg-gray-300" : "")}>
      <CardHeader className="flex items-center text-2xl pb-2 mx-6 px-0 mb-2">
        {header()}
      </CardHeader>
      <CardContent>
        <ShiftInformation shift={props.shift} isGrayedOut={(shiftIsBooked && !userIsParticipating) || (!isUserInOrganisation(props.shift, props.user) && !shiftIsPrivate)} />
        {(!shiftHasPassed && shiftIsFree && props.user.organisations.length > 0) && (
          <Card className="mt-6 items-center rounded-md p-4 w-full">
            <p className="text-md text-muted-foreground">Jag vill jobba som</p>
            <Select value={organisationId} onValueChange={setOrganisationId} >
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
    </form>
  )
}
