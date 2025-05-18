import Image from "next/image";
import SearchBox from "./SearchBox";

const NavBar = ({ titleOverride }: { titleOverride?: string }) => {
  return (
    <nav className="bg-slate-900/90 above-map">
      <div className="mx-auto pl-4 sm:pl-8 pr-2">
        <div className="relative flex h-12 items-center justify-between">
          <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex sm:space-x-4">
              <Image src="/logo.png" alt="logo" height={20} width={30} />
              <span className="ext-sm font-medium text-white hidden sm:block">
                {titleOverride ? titleOverride : "Backcountry Friend"}
              </span>
            </div>
          </div>
          <SearchBox />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
