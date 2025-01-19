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
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import { User, Shift } from "@/lib/types";
import ShiftInformation from "../shiftInformation";
import { CalendarHeart, Terminal } from "lucide-react"
import { useState } from "react";
import { updateShift } from "@/lib/scheduling";

type Props = {
  shift: Shift | null;
  user: User;
  onCancel: () => void;
  changePopup: (isBooking: boolean) => void;
}

export default function BookShiftPopup(props: Readonly<Props>) {
  const submit = (userIsBooking: boolean) => {
    try {
      setIsLoading(true);
      if (props.shift) {
        updateShift(props.shift.id, props.user, organisationId, userIsBooking).then(() => {
          props.changePopup(userIsBooking);
        }
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }

  }

  const [organisationId, setOrganisationId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showIdAlert, setShowIdAlert] = useState<boolean>(false);

  if (!props.shift) {
    return
  }

  const shiftIsBooked = !!((props.shift.workers[0] !== undefined && props.shift.workers[1] !== undefined));

  const shiftIsFree = !!((props.shift.workers[0] === undefined && props.shift.workers[1] === undefined));
  const shiftIsPrivate = (props.shift.organisation === "");
  const shiftHasPassed = new Date(props.shift.start) < new Date();
  const userIsParticipating = !!((props.shift.workers[0] === props.user.name || props.shift.workers[1] === props.user.name));

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
    const copyIdButton = () => {
      return (
        props.user.isAdmin && (
          <Button variant={'outline'} onClick={() => {
            navigator.clipboard.writeText(props.shift?.id ?? '');
            setShowIdAlert(true);
          }}>Kopiera ID</Button>
        )
      );
    }

    if (shiftHasPassed) {
      // The shift has passed, show back button
      return (
        <div className="flex flex-row justify-start gap-5">
          <Button variant="outline" onClick={props.onCancel}>
            Tillbaka
          </Button>
          {copyIdButton()}
        </div>
      )
    }
    if (userIsParticipating) {
      // The user is participating in the shift, show back and cancel button
      return (
        <div className="flex flex-row justify-around w-full">
          <Button variant="outline" onClick={props.onCancel}>
            Tillbaka
          </Button>
          {copyIdButton()}
          <Button variant="destructive" onClick={() => submit(false)} >Avboka</Button>
        </div>
      )
    }
    if (shiftIsBooked || (!shiftIsPrivate && props.shift && !isUserInOrganisation(props.shift, props.user))) {
      // The shift is booked or the user is not in the organisation of the shift, show back button
      return (
        <div className="flex flex-row justify-start gap-5">
          <Button variant="outline" onClick={props.onCancel}>
            Tillbaka
          </Button>
          {copyIdButton()}
        </div>
      )
    }

    return (
      <div className="flex flex-row justify-around w-full">
        <Button variant="outline" onClick={props.onCancel}>
          Tillbaka
        </Button>
        {copyIdButton()}
        <input type="hidden" name="shift-action" value="book-shift" />
        {shiftIsFree && organisationId === "" ?
          <Button disabled>Boka</Button>
          :
          <Button type="submit" onClick={() => submit(true)}>Boka</Button>
        }
      </div>
    )
  }

  return (
    <div className={(shiftHasPassed ? "bg-gray-200 rounded-xl" : "")}>
      <CardHeader className="flex items-center text-2xl pb-2 mx-6 px-0 mb-2" >
        {header()}
      </CardHeader>
      <CardContent>
        <ShiftInformation
          shift={props.shift}
          isGrayedOut={(
            shiftIsBooked && !userIsParticipating)
            ||
            (!isUserInOrganisation(props.shift, props.user) && !shiftIsPrivate
            )}
          isLoading={isLoading}
        />
        {(!shiftHasPassed && shiftIsFree && props.user.organisations.length > 0) && (
          <Card className="mt-6 items-center p-4 w-full">
            <p className="text-md text-muted-foreground">Jag vill jobba som</p>
            <Select value={organisationId} onValueChange={setOrganisationId} >
              <SelectTrigger className="text-xl py-6 mt-1">
                <SelectValue placeholder="Välj förening" />
              </SelectTrigger >
              <SelectContent className="text-xl">
                {/* Render the organisations as items to select (in alphabetical order) */}
                {props.user.organisations
                  .toSorted((a, b) => a.name.localeCompare(b.name))
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

      {/* ID copy alert */}
      {props.user.isAdmin && showIdAlert && (
        <Alert className="absolute top-5 w-96" variant="filled">
          <div className="flex items-center">
            <Terminal className="h-4 w-4 mr-2" />
            ID: <em>{props.shift?.id}</em>&nbsp;är kopierat till urklipp.
          </div>
          <AlertDescription className="mt-2">

            <div className="mt-4 flex justify-start">
              <Button variant="outline" onClick={() => setShowIdAlert(false)}>Stäng</Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div >
  )
}
