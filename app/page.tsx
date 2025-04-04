// import Image from 'next/image';

import { Card } from "@/components/ui/card";

// import ThreeScene from "@/components/scene";
// import { redirect } from "next/navigation";

export default function Page() {
  // redirect('/login');
  return (
    <main className='h-screen w-full'>
      {/* <ThreeScene /> */}

      <div
        className="absolute top-0 w-full h-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url('/coffee-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 bg-white opacity-50"></div>
          
        </div>
      </div>

      <div className="
        h-full flex flex-col p-8 items-center gap-y-8 
        bg-gradient-to-b from-backgroundGradient-start to-backgroundGradient-end
        ">
        {/* <h1 className="text-4xl text-center font-light md:text-8xl">UNDER KONSTRUKTION</h1>
        <hr className="w-44 h-px bg-black border-black border-t" />
        <div className="text-xl text-center md:text-2xl">
          Studentfikets startsida är tyvärr inte färdig än. <br className='hidden md:block' />
          Titta gärna in senare!
        </div> */}
        <Card className="w-full min-h-60 flex flex-col justify-center items-center">

        </Card>
      </div>
    </main >
  );
}
