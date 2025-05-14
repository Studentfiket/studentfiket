"use server";

import { cookies } from "next/headers";
import { Organisation } from "@/lib/types";

export const getUserOrganisations = async (): Promise<Organisation[]> => {
  const cookieStore = cookies();
  const organisationsCookie = cookieStore.get('pb_organisations');
  if (!organisationsCookie) {
    return [];
  }
  const organisations = JSON.parse(organisationsCookie.value);
  return organisations;
}