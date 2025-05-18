import { useEffect, useState } from "react";
import { GeocodingFeature } from "@maptiler/client";
import Image from "next/image";
import { useMapContext } from "../reducers/mapReducer";

const SearchResults = ({
  features,
  handleSelect,
}: {
  features: GeocodingFeature[];
  handleSelect: (feature: GeocodingFeature) => void;
}) => {
  const results = features.map((feature) => {
    return (
      <div
        key={feature.id}
        className="my-2 bg-slate-100 rounded-md p-2 text-slate-950 flex cursor-pointer"
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSelect(feature);
        }}
      >
        <Image
          src="/icons/search_result.svg"
          alt="search result icon"
          height={20}
          width={20}
          className="mr-1"
        />
        <span>{feature.text}</span>
      </div>
    );
  });
  return <>{results}</>;
};

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodingFeature[]>();
  const [hideResults, setHideResults] = useState(false);
  const { dispatch } = useMapContext();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 0) {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = async (search: string) => {
    const results = await fetch(`/api/search?string=${search}`);
    const data = await results.json();
    setSearchResults(data);
  };

  const handleSelect = (feature: GeocodingFeature) => {
    setHideResults(true);
    dispatch({
      type: "setSearchCenter",
      payload: { center: [feature.center[1], feature.center[0]] },
    });
  };

  console.log(hideResults);

  return (
    <div
      className="w-full max-w-sm min-w-[160px] ml-2"
      onBlur={() => setHideResults(true)}
      onFocus={() => setHideResults(false)}
      onClick={() => setHideResults(false)}
    >
      <div className="relative">
        <input
          className=" w-full leading-none bg-white placeholder:text-slate-400 text-slate-700 rounded-md pl-3 pr-16 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm"
          placeholder="Location search, sort of working..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          disabled={true}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {searchResults && !hideResults && (
        <div className="absolute z-[10001] top-12 bg-slate-800 px-2 rounded-md">
          <SearchResults features={searchResults} handleSelect={handleSelect} />
        </div>
      )}
    </div>
  );
};

export default SearchBox;
