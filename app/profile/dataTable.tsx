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
import { getLunchShifts } from "@/utils/sharedFunctions";

type Props = {
  dataContent: Organisation[];
}

export default async function DataTable(props: Readonly<Props>) {

  const { dataContent } = props;
  const pb = await loadPocketBase();
  if (!dataContent || !pb) {
    return <div />
  }

  const organisations = await Promise.all(
    props.dataContent.map(async (organisation) => {
      const organisationShifts = (await getOrganisationShifts(pb, organisation.id));
      return {
        name: organisation.name,
        nrOfShifts: organisationShifts.length - getLunchShifts(organisationShifts) || 0 // Subtract 0.5 for every lunch shift
      };
    })
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
