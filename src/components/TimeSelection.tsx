import { updatePlayerGroup } from "@firebase/player-group";
import { useState } from "react";

type SelectTime = {
  player: Player;
  gameId: string;
  timeIndex: number;
};

const startAtInitial: PlayTime = { hours: 0, minutes: 0 };

const startAtHours: number[] = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
const startAtMinutes: number[] = [0, 15, 30, 45];

const TimeSelection = ({ player, gameId, timeIndex }: SelectTime) => {
  const startTime = player.canPlay[timeIndex];
  const [selectedTime, setSelectedTime] = useState<PlayTime>(startAtInitial);

  const changeTime = (e: React.ChangeEvent<HTMLSelectElement>, isItHours: boolean) => {
    const time: number = Number(e.target.value);

    if (isItHours) setSelectedTime({ ...selectedTime, hours: time });
    else setSelectedTime({ ...selectedTime, minutes: time });
  };

  const updateTime = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let editedAvailability: CanPlay[] = player.canPlay;
    editedAvailability[timeIndex] = selectedTime;
    const editedPlayer: Player = { ...player, canPlay: editedAvailability };

    updatePlayerGroup(gameId, editedPlayer);
  };

  return (
    <form onSubmit={(e) => updateTime(e)}>
      <select
        defaultValue={typeof startTime !== "string" ? `${startTime.hours}` : "Hours"}
        onChange={(e) => {
          setSelectedTime({ ...selectedTime, hours: Number(e.target.value) });
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
        defaultValue={typeof startTime !== "string" ? `${startTime.minutes}` : "Minutes"}
        onChange={(e) => {
          setSelectedTime({ ...selectedTime, minutes: Number(e.target.value) });
          changeTime(e, false);
        }}
      >
        {startAtMinutes.map((sM, index) => (
          <option key={player.id + "sM" + index} value={sM}>
            {sM}
          </option>
        ))}
      </select>
      <button type="submit">Save</button>
    </form>
  );
};

export default TimeSelection;
