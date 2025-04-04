// import ThreeScene from "@/components/scene";
// import { redirect } from "next/navigation";

import HomeCard from "@/components/homeCard";
import Clock from "@/components/clock";
import HomeEventContent from "@/components/homeEventContent";
import { loadClient } from "@/lib/pocketbase";
import { getTodaysShifts } from "@/lib/scheduling";

export default async function Page() {

  const pb = await loadClient();
  const todaysShifts = await getTodaysShifts(pb);
  if (!todaysShifts || todaysShifts.length === 0) {
    return;
  }


  const currentShift = todaysShifts.find(shift => {
    const now = new Date();
    const start = new Date(shift.start);
    const end = new Date(shift.end);
    return now >= start && now < end;
  });

  // redirect('/login');
  return (
    <div className='h-[92vh] w-full'>
      {/* <ThreeScene /> */}

      <div className='absolute top-0 w-full h-3/4 overflow-hidden -z-20'>
        <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-50"></div>
        <div className="absolute inset-0 bg-coffee bg-opacity-20 backdrop-blur-md"></div>

        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/drone1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div
        className="absolute flex flex-col top-0 h-screen w-full"
      >
        <div className='h-3/4 w-full overflow-hidden -z-20 flex flex-col items-start px-6 justify-center gap-y-6'>
          {/* <Clock /> */}
          <div>
            <h1 className="text-white text-4xl md:text-8xl font-light">Ditt studentfik på<br /> Campus Norrköping</h1>
          </div>
          <HomeEventContent todaysShifts={todaysShifts} />
        </div>

        <HomeCard>
          &nbsp;
        </HomeCard>
      </div>
    </div >
  );
}
