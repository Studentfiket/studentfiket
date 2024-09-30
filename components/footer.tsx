import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bottom-0 left-0 right-0 text-white bg-primary px-4 h-[10vh]">
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="flex flex-col">
          <p>&copy; {new Date().getFullYear()} Albin Kjellberg</p>
          <p>Utvecklat av studenter för studenter</p>
        </div>
        <ul className="flex space-x-4">
          <li><Link href="mailto:info@studentfiket.com" className="hover:underline">Kontakta oss</Link></li>
        </ul>
      </div>
    </footer>
  );
}