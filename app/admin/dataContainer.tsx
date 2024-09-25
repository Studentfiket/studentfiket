'use server'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import DataTable from "./dataTable"
import { getMultipleUsers, getOrganisations, loadPocketBase } from "@/lib/pocketbase"

export default async function DataTabs() {

  const pb = await loadPocketBase();
  if (!pb) {
    console.error("Failed to load PocketBase");
    return [];
  }

  const users = await getMultipleUsers(10)

  const organisations = await getOrganisations(pb, 10);
  console.log(organisations);


  // TODO: Make it multi-paged
  return (
    <Tabs defaultValue="org" className="sm:w-[600px]">
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
  )
}
