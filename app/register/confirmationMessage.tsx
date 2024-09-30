import { redirect } from "next/navigation";
import { Button } from "../../components/ui/button";

export default function ConfirmationMessage() {
  return (
    <div className="h-full flex flex-col items-start justify-start gap-y-5">
      <p>Tack för din registrering!</p>
      <p>Vi har skickat ett mail till dig med en länk för att verifiera ditt konto.</p>
      <div className="w-full flex justify-center">
        <Button size="lg" onClick={() => redirect('/login')}>
          Logga in
        </Button>
      </div>
    </div>
  );
}