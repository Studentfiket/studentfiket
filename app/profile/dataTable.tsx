'use server'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getOrganisationShifts } from "@/lib/scheduling";
import { loadPocketBase } from "@/lib/pocketbase";
import { Organisation } from "@/lib/types"

type Props = {
  dataContent: Organisation[];
}

export default async function DataTable(props: Props) {

  const { dataContent } = props;
  const pb = await loadPocketBase();
  if (!dataContent || !pb) {
    return <div />
  }

  const organisations = await Promise.all(
    props.dataContent.map(async (organisation) => ({
      name: organisation.name,
      nrOfShifts: (await getOrganisationShifts(pb, organisation.id)).length || 0
    }))
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={`font-medium`}>Förening</TableHead>
          <TableHead className="text-right">Jobbade pass</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organisations.map((data, index) => (
          <TableRow key={data.name} className={index % 2 === 0 ? "bg-gray-50" : ""}>
            <TableCell className={`font-medium`}>{data.name}</TableCell>
            <TableCell className="text-right">{data.nrOfShifts}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
