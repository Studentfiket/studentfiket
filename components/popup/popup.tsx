import { Shift, User } from "@/lib/types";
import { Card } from "../ui/card";
import BookShiftPopup from "./bookShiftPopup";
import { useState } from "react";
import ConfirmShiftPopup from "./confirmShiftPopup";

type Props = {
  shift: Shift | null;
  user: User;
  onCancel: () => void;
}

export default function Popup(props: Props) {
  // Close the popup when clicking outside of the details panel
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Makes sure the onCancel() is only called when clicking the element thats bound to the onClick (the gray area).
    if (event.target !== event.currentTarget) {
      return;
    }
    closePopup();
  }
  const closePopup = () => {
    setShowConfirmation(false); // Reset the popup
    props.onCancel();           // Close the popup
  }
  const changePopup = (isBooking: boolean) => {
    setShowConfirmation(true);
    setUserIsBooking(isBooking);
  }

  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [userIsBooking, setUserIsBooking] = useState<boolean>(false);

  if (!props.shift) {
    return
  }

  const shiftHasPassed = new Date(props.shift.start) < new Date();
  // If the shift has passed and the user is not an admin, return
  if (shiftHasPassed && !props.user.isAdmin) {
    return
  }

  return (
    <div onClick={handleClick} className="absolute inset-0 w-full h-screen z-20 grid place-items-center bg-[rgba(0,0,0,0.4)]">
      <Card className={"w-11/12 sm:w-[400px] mx-auto"}>
        {!showConfirmation ?
          <BookShiftPopup shift={props.shift} user={props.user} onCancel={closePopup} changePopup={changePopup} />
          :
          <ConfirmShiftPopup shift={props.shift} onCancel={closePopup} userIsBooking={userIsBooking} />
        }
      </Card>
    </div>
  );
}