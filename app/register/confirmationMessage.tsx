import { redirect } from "next/navigation";
import { Button } from "../../components/ui/button";
import Link from "next/link";

export default function ConfirmationMessage() {
  return (
    <div className="h-full flex flex-col items-start justify-start gap-y-5 w-full sm:w-[400px]">
      <h1 className="font-semibold text-2xl">Tack för din registrering!</h1>
      <p>
        För att förhindra att obehöriga skapar konton så kommer vi behöva
        godkänna ditt konto innan du kan logga in. (I regel inom 24 timmar).<br />
        <br />
        {/* TODO: Fix mailto */}
        Om du vill kontakta oss så kan du göra det <Link className="text-indigo-500 hover:underline" href="mailto:info@studentfiket.com">här</Link>.
      </p>
      <div className="w-full flex justify-center">
        <Button size="lg" onClick={() => redirect('/login')}>
          Tillbaka
        </Button>
      </div>
    </div>
  );
}