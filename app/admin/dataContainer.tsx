'use server'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import DataTable from "./dataTable"
import { getUsers as getMultipleUsers, getOrganisations } from "@/lib/pocketbase"

export default async function DataTabs() {
  const users = await getMultipleUsers(10)
  console.log(users);

  const organisations = await getOrganisations()
  console.log(organisations);


  return (
    <Tabs defaultValue="org" className="w-[600px]">
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
