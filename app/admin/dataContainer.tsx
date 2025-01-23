'use server'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import DataTable from "./dataTable"
import { getMultipleUsers, getOrganisations, loadPocketBase } from "@/lib/pocketbase"
import SearchDB from "./searchDB";

type Props = {
  searchParam: string;
}

export default async function DataTabs(props: Props) {
  const pb = await loadPocketBase();
  if (!pb) {
    console.error("Failed to load PocketBase");
    return [];
  }

  const users = await getMultipleUsers(10, props.searchParam);
  const organisations = await getOrganisations(pb, 10, props.searchParam);

  const defaultValues = (organisations && organisations.length > 0) ? "org" : "users";

  return (
    <div className="md:w-[600px]">
      <SearchDB />
      <Tabs defaultValue={defaultValues} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="org">Föreningar</TabsTrigger>
          <TabsTrigger value="users">Användare</TabsTrigger>
        </TabsList>
        <TabsContent value="org">
          <DataTable dataContent={organisations} />
        </TabsContent>
        <TabsContent value="users">
          <DataTable dataContent={users} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
