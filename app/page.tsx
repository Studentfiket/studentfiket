// import Image from 'next/image';

import ThreeScene from "@/components/scene";

export default function Page() {
  console.log("Hello from the home page")
  return (
    <main className='h-screen w-full'>
      <ThreeScene />
      <div className="h-full flex items-center px-10">
        <h1 className="text-8xl">STUDENTFIKET</h1>
      </div>
    </main>
  );
}
