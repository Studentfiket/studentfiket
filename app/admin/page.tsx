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


function AdminPage({
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {


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
            NolleP mode - [UNDER UTVECKLING]
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NollePSwitch />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            Jobbade pass
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataContainer searchParam={Array.isArray(searchParams?.s) ? searchParams.s.join(",") : searchParams?.s || ""} />
        </CardContent>
      </Card>
    </main>
  );
};

export default AdminPage;