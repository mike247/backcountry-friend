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
      } pl-2 pr-2 pt-1 pb-1 flex flex-col justify-center rounded-md ml-1 mr-1`}
      onClick={onClick}
    >
      <Image src={icon} alt={alt} width={45} height={45} title={title} />
      <label>{label}</label>
    </button>
  );
};

export default ControlButton;
