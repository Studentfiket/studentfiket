import { useRouter } from 'next/navigation';
import { Button } from "../../components/ui/button";

export default function ConfirmationMessage() {
  const router = useRouter();
  const redirect = (url: string) => {
    router.push(url);
  }

  return (
    <div className="h-full flex flex-col items-start justify-start gap-y-5 w-full sm:w-[400px]">
      <h1 className="font-semibold text-2xl">Tack för din registrering!</h1>
      <p>
        Du kan nu logga in på ditt nya konto och börja boka pass!<br />
        <br />
        För att förhindra att obehöriga får åtkomst så behöver vi se över alla nya
        konton innan de kan få full tillgång till alla system (i regel inom 24 timmar).
        Detta ska dock inte påverka bokning av pass.<br />
        <br />
        Om du vill kontakta oss så kan du göra det <a className="text-indigo-500 hover:underline" href="mailto:styrelsen@studentfiket.com">här</a>.
      </p>
      <div className="w-full flex justify-center">
        <Button size="lg" onClick={() => redirect('/login')}>
          Logga in
        </Button>
      </div>
    </div>
  );
}