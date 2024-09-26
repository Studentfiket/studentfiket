'use server'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User, Organisation } from "@/lib/types"
import { loadPocketBase } from "@/lib/pocketbase"
import { getUsersShifts } from "@/lib/scheduling"

type Props = {
  dataContent: User[] | Organisation[] | null;
}

type accountData = {
  name: string;
  liuId: string;
  nrOfShifts: number;
}

export default async function DataTable(props: Props) {

  const { dataContent } = props;
  if (!dataContent) {
    return null
  }

  const assignData = async (dataContent: User[] | Organisation[]): Promise<accountData[]> => {
    // Get the shifts for the user
    const pb = await loadPocketBase();
    if (!pb) {
      console.error("Failed to load PocketBase");
      return [];
    }

    pb.autoCancellation(false);
    if (isUserData) {
      const userData = await Promise.all((dataContent as User[]).map(async (user) => ({
        name: user.name,
        liuId: user.username,
        nrOfShifts: (await getUsersShifts(pb, user))?.length || 0,
      })));
      pb?.autoCancellation(true);
      return userData;
    } else {
      return (dataContent as Organisation[]).map((organisation) => ({
        name: organisation.name,
        liuId: "",
        nrOfShifts: organisation.nrOfShifts,
      }));
    }
  }

  const isUserData = (dataContent as User[])[0]?.username !== undefined;
  const tableData = await assignData(dataContent);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={`font-medium ${isUserData && 'sm:table-cell hidden'}`}>Namn</TableHead>
          {isUserData && <TableHead>LiuId</TableHead>}
          <TableHead className="text-right">Jobbade pass</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((data, index) => (
          <TableRow key={data.name} className={index % 2 === 0 ? "bg-gray-50" : ""}>
            <TableCell className={`font-medium ${isUserData && 'sm:block hidden'}`}>{data.name}</TableCell>
            {isUserData && <TableCell>{data.liuId}</TableCell>}
            <TableCell className="text-right">{data.nrOfShifts}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
