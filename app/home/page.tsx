import { Cog } from 'lucide-react';

export default function Page() {
  return (
    <main className='h-screen w-full'>
      {/* <ThreeScene /> */}
      <div className="h-full flex flex-col justify-center items-center gap-y-8 bg-gradient-to-b from-backgroundGradient-start to-backgroundGradient-end">
        <h1 className="text-4xl text-center font-light md:text-8xl">UNDER KONSTRUKTION</h1>
        <hr className="w-44 h-px bg-black border-black border-t" />
        <div className="text-xl text-center md:text-2xl">
          Studentfikets startsida är tyvärr inte färdig än. <br className='hidden md:block' />
          Titta gärna in senare!
        </div>
        <Cog size={128} className="text-redAccent animate-spin" style={{ animationDuration: '6000ms' }} />
      </div>
    </main>
  )
}