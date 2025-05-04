import { SiFacebook } from "react-icons/si";
import { IoMdMail, IoIosBug, IoMdLink } from "react-icons/io";

export default function Footer() {
  return (
    <footer className="left-0 right-0 bottom-0 text-white bg-primary px-4 sm:h-[10vh] py-5">
      <div className="container mx-auto flex flex-col-reverse sm:flex-row justify-between items-start h-full sm:items-center">
        <ul className="text-sm sm:text-md flex flex-col items-start sm:items-start mt-4 sm:mt-0">
          <li>
            <a href="http://www.kjellbergalbin.se" target="_blank" rel="noopener noreferrer" className="flex items-center gap-x-2">
              &copy;{new Date().getFullYear()} Albin Kjellberg
              <IoMdLink size={16} className="text-white" />
            </a>
          </li>
          <li>Denna hemsida är byggd av studenter vid LiU</li>
        </ul>

        <div className="flex flex-row items-center gap-x-4">
          <button className="flex justify-center items-center bg-primary shadow-lg p-1 w-11 h-11 rounded-xl  transition-all hover:bg-foregroundLight">
            <a href="https://www.facebook.com/studentfiket/?locale=sv_SE"><SiFacebook size={30} /></a>
          </button>
          <button className="flex justify-center items-center bg-primary shadow-lg p-1 w-11 h-11 rounded-xl  transition-all hover:bg-foregroundLight">
            <a href="mailto:styrelsen@studentfiket.com"><IoMdMail size={36} /></a>
          </button>
          <button className="flex justify-center items-center bg-secondary shadow-lg w-10 h-10 rounded-xl transition-all hover:bg-foregroundLight">
            <a href="/feedback" className="flex justify-center items-center hover:invert w-full h-full"><IoIosBug size={34} color="#18181b" /></a>
          </button>
        </div>
      </div>
    </footer>
  );
}