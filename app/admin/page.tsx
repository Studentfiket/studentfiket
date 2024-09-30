'use server'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import GeneratePeriod from "./generatePeriod";
import DataContainer from "./dataContainer";


function AdminPage({
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {


  return (
    <div className="flex flex-col gap-y-4 w-screen" style={{ padding: '20px' }}>
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
            Jobbade pass
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataContainer searchParam={Array.isArray(searchParams?.s) ? searchParams.s.join(",") : searchParams?.s || ""} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;