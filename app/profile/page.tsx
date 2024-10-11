'use server'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { loadPocketBase, getUser, getUserOrganisations } from "@/lib/pocketbase";
import { getUsersShifts } from "@/lib/scheduling";
import DataTable from "./dataTable";


async function ProfilePage() {
  const getShiftMessage = (nrOfShifts: number) => {
    if (nrOfShifts === 0) {
      return "Du har inte jobbat några pass än :(";
    } else if (nrOfShifts === 1) {
      return "Du har jobbat ett pass, keep going!";
    } else if (nrOfShifts === 2) {
      return "Två pass ändå, det går framåt!";
    }
    else if (nrOfShifts >= 3 && nrOfShifts <= 5) {
      return `${nrOfShifts} pass är ju toppen, bra jobbat!`;
    }
    else {
      return `${nrOfShifts} pass?? Du är en riktig hjälte!`;
    }
  }

  const pb = await loadPocketBase();
  const user = await getUser();
  if (!user || !pb) {
    return <div>Loading...</div>;
  }
  // const userAvatar: string = await getAvatar(user.id, user.avatar) ?? '';
  const userShifts = await getUsersShifts(pb, user);
  const organisations = await getUserOrganisations();


  return (
    <main className="flex flex-col gap-y-4 w-full h-[82vh]" style={{ padding: '20px' }}>
      <Card className="sm:w-[600px]">
        <CardHeader>
          {/* {userAvatar}
          <Image
            src={userAvatar}
            alt="avatar"
            width={50}
            height={50}
          /> */}
          <CardTitle className="text-4xl tabular-nums">
            {user.name}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="sm:w-[600px]">
        <CardHeader>
          <CardDescription>Du har jobbat</CardDescription>
          <CardTitle className="text-4xl tabular-nums">
            {userShifts?.length}
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground ml-1">
              pass
            </span>
          </CardTitle>
          <CardDescription>
            {getShiftMessage(userShifts?.length)}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="sm:w-[700px]">
        <CardHeader>
          <CardTitle>
            Dina föreningar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable dataContent={organisations} />
        </CardContent>
      </Card>
    </main>
  );
};

export default ProfilePage;