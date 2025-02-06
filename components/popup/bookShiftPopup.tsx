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
import { isCancellationAllowed } from "@/utils/sharedFunctions";
import { NotCancellableAlert } from "../ui/custom/notCancellableAlert";

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
  const [showNotCancellableAlert, setShowNotCancellableAlert] = useState<boolean>(false);

  if (!props.shift) {
    return
  }

  const shiftIsBooked = !!((props.shift.workers[0] !== undefined && props.shift.workers[1] !== undefined));

  const shiftHasPassed = new Date(props.shift.start) < new Date();
  const shiftIsFree = !!((props.shift.workers[0] === undefined && props.shift.workers[1] === undefined) && props.shift.organisation === "");
  const shiftIsPrivate = (props.shift.organisation === "");
  const userIsParticipating = !!((props.shift.workers[0] === props.user.name || props.shift.workers[1] === props.user.name));
  const shiftIsCancellable = isCancellationAllowed(props.shift.start);

  // Check if the user is in the organisation of the shift
  const isUserInOrganisation = (shift: Shift, user: User) => {
    for (const organisation of user.organisations) {
      if (shift.organisation === organisation.name) {
        return true;
      }
    }
  }

  // Check if the shift is bookable
  const isBookable = (shiftIsFree && !shiftHasPassed && !userIsParticipating);


  const header = () => {
    if (shiftHasPassed) {
      // The shift has passed, shows back button
      return <CardTitle className="font-normal">Detta pass har redan passerat</CardTitle>;
    }
    if (userIsParticipating) {
      // The user is participating in the shift, shows back and cancel button
      return <CardTitle className="font-normal">Du jobbar detta pass</CardTitle>;
    }

    if (!shiftIsPrivate && props.shift && !isUserInOrganisation(props.shift, props.user)) {
      // The user is not in the organisation of the shift, shows back button
      return <CardTitle className="font-normal">Detta pass kan inte bokas</CardTitle>;
    }

    if (shiftIsBooked) {
      // The shift is booked, shows back button
      return <CardTitle className="font-normal">Detta pass är bokat</CardTitle>;
    }

    return (
      // The shift is free, shows booking button
      <div className="flex items-center">
        <CalendarHeart className="h-full mt-1 mr-2" />
        <CardTitle className="font-normal">Boka Pass</CardTitle>
      </div>
    );
  };

  /// Footer of the popup
  const footer = () => {
    /// Show the copy ID button if the user is an admin
    const copyIdButton = () => {
      return (
        props.user.isAdmin && (
          <Button variant={'outline'} onClick={() => {
            navigator.clipboard.writeText(props.shift?.id ?? '');
            setShowIdAlert(true);
          }}><span className="hidden sm:block">Kopiera </span>ID</Button>
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
          {shiftIsCancellable ?
            <Button variant="destructive" onClick={() => submit(false)}>Avboka</Button>
            :
            <Button variant="destructive" className="opacity-50" onClick={() => setShowNotCancellableAlert(true)}>Avboka</Button>}
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

    // The shift is free, show booking button
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

  // If the shift is not bookable or the user is not in any organisation, set organisation to private
  if (isBookable && props.user.organisations.length === 0 && organisationId !== "private") {
    setOrganisationId("private");
    console.log("Shift is not bookable or user is not in any organisation, setting organisation to private");
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
        {/* If the shift is bookable and the user is in at least 1 organisation; they get to choose */}
        {(isBookable && props.user.organisations.length > 0) && (
          <Card className="mt-6 items-center p-4 w-full rounded-md">
            <p className="text-md text-muted-foreground">Jag vill jobba som</p>
            <Select value={organisationId} onValueChange={setOrganisationId} >
              <SelectTrigger className="text-xl py-6 mt-1">
                <SelectValue placeholder="Välj förening" />
              </SelectTrigger>
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
      <CardFooter className="w-full flex flex-col">
        {/* Show the not cancellable alert */}
        {showNotCancellableAlert && <NotCancellableAlert variant={"destructive"} />}
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
