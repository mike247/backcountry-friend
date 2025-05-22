import Image from "next/image";

const ControlButton = ({
  icon,
  alt,
  title,
  label,
  variant,
  onClick,
}: {
  icon: string;
  alt: string;
  title: string;
  label: string;
  variant: "inactive" | "active";
  onClick?: () => void;
}) => {
  const colors = {
    inactive: "bg-slate-700 hover:bg-slate-600",
    active: "bg-lime-700 hover:bg-lime-600",
  };
  return (
    <button
      className={`${
        colors[variant] || "bg-slate - 700"
      } px-2 py-1 flex flex-col flex-grow justify-center items-center rounded-md m-1`}
      onClick={onClick}
    >
      <Image src={icon} alt={alt} width={30} height={30} title={title} />
      <label className="text-sm">{label}</label>
    </button>
  );
};

export default ControlButton;
