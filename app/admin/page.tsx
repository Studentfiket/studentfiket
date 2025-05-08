'use server'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import GeneratePeriod from "./generatePeriod";
import DataContainer from "./dataContainer";
import NollePSwitch from "./nollePSwitch";
import { getFlag } from "../actions/meta/getFlag";


async function AdminPage({
  searchParams,
}: Readonly<{
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}>) {

  // Check if it is currently in Nolle-P mode
  const isNolleP = await getFlag("NOLLE_P")

  return (
    <main className="flex flex-col gap-y-4 w-full" style={{ padding: '20px' }}>
      <h1>
        Admin Dashboard
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>
            Skift
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GeneratePeriod />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            Nolle-P mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NollePSwitch isNolleP={isNolleP} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            Jobbade pass
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataContainer searchParam={Array.isArray(searchParams?.s) ? searchParams.s.join(",") : searchParams?.s ?? ""} />
        </CardContent>
      </Card>
    </main>
  );
};

export default AdminPage;