import type Client from "pocketbase";
import { Organisation } from "@/lib/types";
import { getOrganisationShifts } from "@/lib/scheduling";
import { getLunchShifts } from "@/utils/sharedFunctions";

export const getOrganisations = async (pb: Client, limit: number, nameSearch: string): Promise<Organisation[] | null> => {
  try {
    pb.autoCancellation(false);
    const organisation = await pb.collection('organisations').getList(1, limit, {
      filter: `name ~ "${nameSearch}"`,
      sort: '-name'
    });
    const mappedOrganisations: Organisation[] = await Promise.all(organisation.items.map(async (record) => {
      const organisationShifts = (await getOrganisationShifts(pb, record.id));
      return {
        id: record.id,
        name: record.name,
        nrOfShifts: organisationShifts.length - getLunchShifts(organisationShifts)  // Subtract 0.5 for every lunch shift
      };
    }));
    pb.autoCancellation(true);
    return mappedOrganisations;
  } catch (error) {
    console.error("Error getting organisation: ", error);
    return null;
  }
}