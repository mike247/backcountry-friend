import Link from "next/link";
import Image from "next/image";
import SearchBox from "./SearchBox";

const NavBar = () => {
  return (
    <nav className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-12 items-center justify-between">
          <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:block">
              <div className="flex space-x-4">
                <Image src="/logo.png" alt="logo" height={20} width={30} />
                <span className="ext-sm font-medium text-white">
                  Backcountry Friend
                </span>
              </div>
            </div>
          </div>
          <SearchBox />
          <div>
            <span>Login - coming soon</span>
          </div>
        </div>
      </div>

      <div className="sm:hidden" id="mobile-menu">
        <div className="space-y-1 px-2 pt-2 pb-3">
          <Link
            href="/"
            className="block rounded-md bg-slate-900 px-3 py-2 text-base font-medium text-white"
            aria-current="page"
          >
            Map
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
