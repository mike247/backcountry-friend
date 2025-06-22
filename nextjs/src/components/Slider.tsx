import { useMapContext } from "@/reducers/context";

const Slider = ({
  shader,
  slider,
  value,
  legend,
  title,
  min,
  gradient,
  legendOnly,
  max,
  blocks = false,
}: {
  shader: string;
  slider: string;
  value: number;
  title: string;
  gradient: string[] | null;
  legend?: string[];
  min: number;
  legendOnly: boolean;
  max: number;
  blocks?: boolean;
}) => {
  const { dispatch } = useMapContext();
  gradient = gradient || [];
  let linearGradient;
  if (blocks) {
    const step = 100 / gradient.length;
    const stops: string[] = [];

    for (let i = 0; i < gradient.length; i++) {
      const start = (step * i).toFixed(2);
      const end = (step * (i + 1)).toFixed(2);
      const color = gradient[i];

      stops.push(`${color} ${start}%`);
      stops.push(`${color} ${end}%`);
    }

    linearGradient = stops.join(",\n  ");
  } else {
    linearGradient = gradient.join(",");
  }
  return (
    <div className="aboveMap bg-slate-900/75 sm:rounded-lg my-1 p-2 flex-col justify-center text-white">
      <label htmlFor={title}>{title}</label>
      {legendOnly ? (
        <div
          className="w-full my-2 h-2 bg-gray-900 rounded-lg appearance-none dark:bg-gray-200"
          style={{
            backgroundImage: gradient
              ? `linear-gradient(to right, ${linearGradient})`
              : "",
          }}
        />
      ) : (
        <input
          id={title}
          type="range"
          disabled={legendOnly}
          value={(value / max) * 100}
          style={{
            backgroundImage: gradient
              ? `linear-gradient(to right, ${linearGradient})`
              : "",
          }}
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
      )}

      {legend && (
        <div
          className={`${
            blocks ? "flex justify-around" : "flex justify-between"
          } flex-grow`}
        >
          {legend.map((value: string) => (
            <span key={value}>{value}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
