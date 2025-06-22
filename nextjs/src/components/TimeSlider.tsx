import { useMapContext } from "@/reducers/context";

const TimeSlider = () => {
  const { map, dispatch } = useMapContext();
  const now = new Date();
  const oneDay = 86400000;
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );
  const sinceMidnight = map.effectsState.sun.timestamp - midnight.getTime();
  const value = (sinceMidnight / oneDay) * 100;
  return (
    <div className="aboveMap bg-slate-900/75 sm:rounded-lg my-1 p-2 flex-col justify-center text-white">
      <input
        id="default-range"
        type="range"
        value={value}
        onChange={(e) =>
          dispatch({
            type: "updateTimestamp",
            payload: {
              value:
                oneDay * (Number.parseFloat(e.target.value) / 100) +
                midnight.getTime(),
            },
          })
        }
        className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer dark:bg-gray-200"
      />
      <div className="flex justify-between">
        <span>Morning</span>
        <span>Evening</span>
      </div>
    </div>
  );
};

export default TimeSlider;
