import { SiFacebook } from "react-icons/si";
import { IoMdMail, IoIosBug } from "react-icons/io";

export default function Footer() {
  return (
    <footer className="left-0 right-0 text-white bg-primary px-4 sm:h-[10vh] py-5">
      <div className="container mx-auto flex flex-col-reverse sm:flex-row justify-between items-start h-full sm:items-center">
        <ul className="text-sm sm:text-md flex flex-col items-start sm:items-start mt-4 sm:mt-0">
          <li>&copy;{new Date().getFullYear()} Albin Kjellberg</li>
          <li>Denna hemsida är byggd av studenter vid LiU</li>
        </ul>

        <div className="flex flex-row items-center text-left gap-x-4">
          <button className="bg-primary shadow-lg p-1 rounded transition-all hover:bg-foregroundLight">
            <a href="https://www.facebook.com/studentfiket/?locale=sv_SE" className="hover:underline"><SiFacebook size={30} /></a>
          </button>
          <button className="bg-primary shadow-lg p-1 rounded transition-all hover:bg-foregroundLight">
            <a href="mailto:styrelsen@studentfiket.com" className="hover:underline"><IoMdMail size={36} /></a>
          </button>
          <button className="bg-primary shadow-lg p-1 rounded transition-all hover:bg-foregroundLight">
            <a href="/feedback" className="hover:underline"><IoIosBug size={34} /></a>
          </button>
        </div>
      </div>
    </footer>
  );
}