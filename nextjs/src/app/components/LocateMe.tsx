import Image from "next/image";
import { useMap } from "react-leaflet";

const LocateMe = () => {
  const map = useMap();
  return (
    <div className="absolute top-20 left-2 above-map">
      <Image
        src="/icons/gps.svg"
        alt="Locate me"
        height="35"
        width="35"
        onClick={() => map.locate({ setView: true, maxZoom: 14 })}
        className="hover:scale-150 duration-200"
      />
    </div>
  );
};

export default LocateMe;
