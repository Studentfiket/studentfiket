// import ThreeScene from "@/components/scene";
// import { redirect } from "next/navigation";

import HomeEventContent from "@/components/homeEventContent";
import { IconWithText } from "@/components/homepageButton";
import { Card } from "@/components/ui/card";
import { loadClient } from "@/lib/pocketbase";
import { getTodaysShifts } from "@/lib/scheduling";
import { Shift } from "@/lib/types";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";
import { FiCoffee, FiCalendar } from "react-icons/fi";

export default async function Page() {

  const pb = await loadClient();
  // const todaysShifts = await getTodaysShifts(pb);

  const mockShifts: Shift[] = [
    {
      id: "2",
      organisation: "Studentfiket",
      workers: ["Charlie", "Dave"],
      start: DateTime.fromISO(new Date().toISOString())
        .setZone("utc")
        .set({ hour: 12, minute: 0, second: 0, millisecond: 0 })
        .toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
      end: DateTime.fromISO(new Date().toISOString())
        .setZone("utc")
        .set({ hour: 15, minute: 0, second: 0, millisecond: 0 })
        .toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
    },
    {
      id: "3",
      organisation: "Studentfiket",
      workers: ["Eve", "Frank"],
      start: DateTime.fromISO(new Date().toISOString())
        .setZone("utc")
        .set({ hour: 17, minute: 0, second: 0, millisecond: 0 })
        .toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
      end: DateTime.fromISO(new Date().toISOString())
        .setZone("utc")
        .set({ hour: 18, minute: 0, second: 0, millisecond: 0 })
        .toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
    },
    {
      id: "4",
      organisation: "Studentfiket",
      workers: ["Grace", "Hank"],
      start: DateTime.fromISO(new Date().toISOString())
        .setZone("utc")
        .set({ hour: 18, minute: 0, second: 0, millisecond: 0 })
        .toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
      end: DateTime.fromISO(new Date().toISOString())
        .setZone("utc")
        .set({ hour: 20, minute: 0, second: 0, millisecond: 0 })
        .toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
    },
    {
      id: "5",
      organisation: "Studentfiket",
      workers: ["Ivy", "Jack"],
      start: DateTime.fromISO(new Date().toISOString())
        .setZone("utc")
        .set({ hour: 20, minute: 0, second: 0, millisecond: 0 })
        .toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
      end: DateTime.fromISO(new Date().toISOString())
        .setZone("utc")
        .set({ hour: 22, minute: 0, second: 0, millisecond: 0 })
        .toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
    },
    {
      id: "6",
      organisation: "Studentfiket",
      workers: ["Ivy", "Jack"],
      start: DateTime.fromISO(new Date().toISOString())
        .setZone("utc")
        .set({ hour: 22, minute: 0, second: 0, millisecond: 0 })
        .toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
      end: DateTime.fromISO(new Date().toISOString())
        .setZone("utc")
        .set({ hour: 23, minute: 0, second: 0, millisecond: 0 })
        .toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
    },
  ];

  const todaysShifts = mockShifts;

  return (
    <div className='w-full bg-latte flex justify-center'>
      <div className='w-full min-h-[92vh] max-w-[1300px] flex flex-col md:items-start md:pt-8 px-6 md:px-20 pb-6 gap-y-6 md:gap-x-12'>
        {/* Hero and schedule */}
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex flex-col gap-6 text-center lg:pb-4 lg:bg-latteBright rounded-xl">
            <div className="h-[150px] flex justify-center items-center">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={2000}
                height={580}
                className="object-contain h-full"
              />
            </div>

            <Card className="p-4 mx-4 h-full hidden lg:block">
              <h3 className="font-bold mb-3">Ditt studentfik på Campus Norrköping</h3>
              <p>
                Studentfiket är ett café som drivs av studenter för studenter på Campus Norrköping.
                Vårt mål är att erbjuda en trevlig mötesplats med prisvärda alternativ för fika och lunch.
                Varje dag drivs caféet av olika studentföreningar, sektioner och festerier från Linköpings Universitet.
                Detta ger dig möjlighet att träffa andra studenter från olika program och föreningar.
              </p>
            </Card>

          </div>
          {todaysShifts && todaysShifts.length > 0 && (
            <HomeEventContent todaysShifts={todaysShifts} />
          )}
        </div>
        {/* Info */}
        <div className="relative rounded-2xl bg-white shadow-lg">
          <div className="flex flex-col gap-y-4 p-8 lg:px-12 items-center mx-auto">
            <div className="w-full flex flex-col lg:flex-row justify-between gap-8">
              {/* First paragraph is moved up on desktop */}
              <div className="lg:hidden">
                <h3 className="font-bold mb-3">Ditt studentfik på Campus Norrköping</h3>
                <p>
                  Studentfiket är ett café som drivs av studenter för studenter på Campus Norrköping.
                  Vårt mål är att erbjuda en trevlig mötesplats med prisvärda alternativ för fika och lunch.
                  Varje dag drivs caféet av olika studentföreningar, sektioner och festerier från Linköpings Universitet.
                  Detta ger dig möjlighet att träffa andra studenter från olika program och föreningar.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-3">Studentanpassade priser</h3>
                <p>
                  Innan vi öppnade fanns det bara ett café på Campus, helt utan konkurrens. Vi tycker att
                  priserna var/är för höga för att passa studenter och tanken med vår förening är att skapa
                  ett café med billigare priser liknande det som finns i Baljan i Kårallen på Campus Valla.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-3">Naturlig samlingsplats</h3>
                <p>
                  Vårt mål är att hålla priserna nere så mycket som möjligt, men förhoppningen är också att
                  caféet ska bli en naturlig samlingsplats för studenter från alla fakulteter, och också leda
                  till nya kontakter och gemenskap över sektions- och fakultetsgränserna. En plats där man kan
                  fika, kanske plugga eller bara sitta och prata en stund. Vi hoppas därför på fler samarbeten
                  med andra föreningar! Har ni någon idé, kom förbi och berätta!
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-3">Idéellt arbete</h3>
                <p>
                  För att vi ska kunna ha öppet krävs det dock att fler vill engagera sig och jobba, då vi gör
                  detta helt ideellt. Är det något du undrar över och vill fråga om, tveka inte utan kontakta&nbsp;
                  <Link className="underline" href="mailto:styrelsen@studentfiket.com">styrelsen@studentfiket.com</Link> eller besök
                  oss på plan 5 i Täppan. Passa även på att fika lite också!
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center mt-12 gap-y-4 gap-x-8">
              <IconWithText
                icon={<FiCoffee size={24} className="text-white" />}
                title="Besök oss"
                description={
                  <p className="text-sm">
                    Kåkenhus, Kopparhammaren 2<br />
                    Campus Norrköping, Linköpings Universitet
                  </p>
                }
              />

              <IconWithText
                icon={<FiCalendar size={24} className="text-white" />}
                title="Boka ett pass"
                description={
                  <p className="text-sm">
                    Logga in eller skapa ett konto för att <br />
                    boka ett pass och bli en del av Studentfiket.
                  </p>
                }
                url={"/login"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
