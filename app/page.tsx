// import Image from 'next/image';

import ThreeScene from "@/components/scene";

export default function Home() {
  return (
    <main className='h-full'>
      <div className='h-1-2'>
        {/* TODO: Add a background image to the div below */}
        {/* <div className="w-full h-full p-7 bg-[url:]">
        </div> */}
        <ThreeScene />
        <h1 className="text-4xl font-bold mb-4">Welcome to Studentfiket</h1>
        <p className="text-lg mb-8">Your favorite place to hang out and enjoy delicious treats!</p>

      </div>
    </main>
  );
}
