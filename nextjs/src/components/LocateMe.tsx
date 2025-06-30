import Image from "next/image";

const LocateMe = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="m-[12px] cursor-pointer">
      <Image
        src="/icons/gps.svg"
        alt="Locate me"
        height="27"
        width="27"
        onClick={onClick}
        // className="hover:scale-150 duration-200"
      />
    </div>
  );
};

export default LocateMe;
