import { updatePlayerGroup } from "@firebase/player-group";
import { useState } from "react";
import { RiSave3Fill } from "react-icons/ri";

type SelectTime = {
  player: Player;
  gameId: string;
  timeIndex: number;
};

const startAtHours: number[] = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
const startAtMinutes: number[] = [0, 15, 30, 45];

const TimeSelection = ({ player, gameId, timeIndex }: SelectTime) => {
  const startTime = player.canPlay[timeIndex];
  const [selectedTime, setSelectedTime] = useState<PlayTime>({ hours: Number(typeof startTime !== "string" && startTime.hours), minutes: Number(typeof startTime !== "string" && startTime.minutes) });
  const [timeChanged, setTimeChanged] = useState<boolean>(false);

  const changeTime = (e: React.ChangeEvent<HTMLSelectElement>, isItHours: boolean) => {
    const time: number = Number(e.target.value);

    if (isItHours) setSelectedTime({ ...selectedTime, hours: time });
    else setSelectedTime({ ...selectedTime, minutes: time });
  };

  const updateTime = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTimeChanged(false);
    let editedAvailability: CanPlay[] = player.canPlay;
    editedAvailability[timeIndex] = selectedTime;
    const editedPlayer: Player = { ...player, canPlay: editedAvailability };

    updatePlayerGroup(gameId, editedPlayer);
  };

  return (
    <form onSubmit={(e) => updateTime(e)} className="grid grid-rows-2 justify-items-center items-center">
      <div className="flex gap-2">
        <select
          defaultValue={selectedTime.hours}
          onChange={(e) => {
            setSelectedTime({ ...selectedTime, hours: Number(e.target.value) });
            setTimeChanged(true);
            changeTime(e, true);
          }}
        >
          {startAtHours.map((sH, index) => (
            <option key={player.id + "sH" + index} value={sH}>
              {sH}
            </option>
          ))}
        </select>
        <select
          defaultValue={selectedTime.minutes}
          onChange={(e) => {
            setSelectedTime({ ...selectedTime, minutes: Number(e.target.value) });
            setTimeChanged(true);
            changeTime(e, false);
          }}
        >
          {startAtMinutes.map((sM, index) => (
            <option key={player.id + "sM" + index} value={sM}>
              {sM}
            </option>
          ))}
        </select>
        {timeChanged && (
          <button type="submit" className="rounded-md text-indigo-800">
            <RiSave3Fill size={35} />
          </button>
        )}
      </div>
      {typeof startTime !== "string" && <span>{`${startTime.hours}:${startTime.minutes === 0 ? startTime.minutes + "0" : startTime.minutes}`}</span>}
    </form>
  );
};

export default TimeSelection;
