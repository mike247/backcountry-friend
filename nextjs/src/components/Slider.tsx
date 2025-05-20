import { useMapContext } from "@/reducers/mapReducer";

const Slider = ({
  shader,
  slider,
  value,
  legend,
  title,
  min,
  max,
}: {
  shader: string;
  slider: string;
  value: number;
  title: string;
  legend?: string[];
  min: number;
  max: number;
}) => {
  const { dispatch } = useMapContext();

  return (
    <div className="aboveMap bg-slate-900/75 sm:rounded-lg my-1 p-2 flex-col justify-center text-white">
      <label htmlFor={title}>{title}</label>
      <input
        id={title}
        type="range"
        value={(value / max) * 100}
        onChange={(e) => {
          dispatch({
            type: "updateSlider",
            payload: {
              shader: shader,
              slider: slider,
              value: (Number.parseFloat(e.target.value) / 100) * max + min,
            },
          });
        }}
        className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer dark:bg-gray-200"
      />
      {legend && (
        <div className="flex justify-between flex-grow">
          {legend.map((value: string) => (
            <span key={value}>{value}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
