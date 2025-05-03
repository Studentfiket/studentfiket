// import ThreeScene from "@/components/scene";
// import { redirect } from "next/navigation";

import HomeEventContent from "@/components/homeEventContent";
import { IconWithText } from "@/components/homepageButton";
import { loadClient } from "@/lib/pocketbase";
import { getTodaysShifts } from "@/lib/scheduling";
import { Shift } from "@/lib/types";
import { DateTime } from "luxon";
import Image from "next/image";
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
        .set({ hour: 17, minute: 0, second: 0, millisecond: 0 })
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
    <div className='w-full'>
      {/* Background video */}
      <div className='absolute top-0 w-full h-full -z-20 bg-latte'>
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-50"></div>
        <div className="absolute inset-0 bg-coffee bg-opacity-5 backdrop-blur-md"></div>

        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/drone1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
      </div>

      <div
        className="flex flex-col top-0 w-full -z-20 bg-latte"
      >
        <div className='w-full min-h-[92vh] flex flex-col md:flex-row-reverse items-center md:items-start pt-8 md:pt-32 px-6 md:px-20 pb-6 gap-y-6 md:gap-x-12'>
          {/* Hero */}
          <div className="text-center md:text-left max-w-2xl">
            {/* <h1 className="text-white text-4xl md:text-7xl font-light leading-tight">
              Ditt studentfik på<br /> Campus Norrköping
            </h1> */}
            <div className="md:w-1/2">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={2000}
                height={619} />
            </div>
          </div>
          {todaysShifts && todaysShifts.length > 0 && (
            <HomeEventContent todaysShifts={todaysShifts} />
          )}
          {/* Info */}
          <div className="relative rounded-2xl bg-white shadow-lg">
            <div className="md:w-3/4 flex flex-col gap-y-4 px-4 items-center mx-auto">
              {/* <div className="md:w-1/2">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={2000}
                height={619} />
            </div> */}

              <div className="md:w-1/2 flex flex-col gap-y-4 ">
                <div className="p-4">
                  <h3 className="font-bold mb-3">Ditt studentfik på Campus Norrköping</h3>
                  <p>
                    Studentfiket är ett café som drivs av studenter för studenter på Campus Norrköping.
                    Vårt mål är att erbjuda en trevlig mötesplats med prisvärda alternativ för fika och lunch.
                    Varje dag drivs caféet av olika studentföreningar, sektioner och festerier från Linköpings Universitet.
                    Detta ger dig möjlighet att träffa andra studenter från olika program och föreningar.
                  </p>
                </div>
              </div>

              <div className="w-full flex flex-col md:flex-row justify-between gap-4 mt-8">
                <div className="p-4">
                  <h3 className="font-bold mb-3">Studentanpassade priser</h3>
                  <p>Innan vi öppnade fanns det bara ett café på Campus, helt utan konkurrens. Vi tycker att priserna var/är för höga för att passa studenter och tanken med vår förening är att skapa ett café med billigare priser liknande det som finns i Baljan i Kårallen på Campus Valla.</p>
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-3">Naturlig samlingsplats</h3>
                  <p>Vårt mål är att hålla priserna nere så mycket som möjligt, men förhoppningen är också att caféet ska bli en naturlig samlingsplats för studenter från alla fakulteter, och också leda till nya kontakter och gemenskap över sektions- och fakultetsgränserna. En plats där man kan fika, kanske plugga eller bara sitta och prata en stund. Vi hoppas därför på fler samarbeten med andra föreningar! Har ni någon idé, kom förbi och berätta!</p>
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-3">Idéellt arbete</h3>
                  <p>För att vi ska kunna ha öppet krävs det dock att fler vill engagera sig och jobba, då vi gör detta helt ideellt. Är det något du undrar över och vill fråga om, tveka inte utan kontakta styrelsen@studentfiket.com eller besök oss på plan 5 i Täppan. Passa även på att fika lite också!</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center my-12 gap-y-4 gap-x-8">
                <IconWithText
                  icon={<FiCoffee size={24} className="text-primary" />}
                  title="Besök oss"
                  description={
                    <p className="text-sm">
                      Kåkenhus, Kopparhammaren 2<br />
                      Campus Norrköping, Linköpings Universitet
                    </p>
                  }
                />

                <IconWithText
                  icon={<FiCalendar size={24} className="text-primary" />}
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




              {/* <div className="flex flex-col md:flex-row items-center my-12 gap-4">
              <div className="flex items-center">
                <div className="bg-primary p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"></path>
                    <line x1="6" y1="2" x2="6" y2="4"></line>
                    <line x1="10" y1="2" x2="10" y2="4"></line>
                    <line x1="14" y1="2" x2="14" y2="4"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold">Besök oss</h3>
                  <p className="text-sm">
                    Kåkenhus, Kopparhammaren 2<br />
                    Campus Norrköping, Linköpings Universitet
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>

              </div>
              <button className="text-left" onClick={() => redirect("/login")}>
                <h3 className="font-bold">Boka ett pass</h3>
                <p className="text-sm">
                  Logga in eller skapa ett konto för att <br />
                  boka ett pass och bli en del av Studentfiket.
                </p>
              </button>
            </div> */}

            </div>

          </div>
        </div>


      </div>
    </div>
  );
}
