import { updatePlayerGroup } from "@firebase/player-group";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { createPortal } from "react-dom";

type SelectTime = {
  player: Player;
  gameId: string;
  timeIndex: number;
};

const startAtHours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const startAtMinutes: number[] = [0, 15, 30, 45];

const TimeSelection = ({ player, gameId, timeIndex }: SelectTime) => {
  const startTime: CanPlay = player.canPlay[timeIndex];

  const [selectedFromTime, setSelectedFromTime] = useState<PlayTime>({
    hours: Number(typeof startTime !== "string" && typeof startTime.fromTime !== "string" ? startTime.fromTime.hours : 0),
    minutes: Number(typeof startTime !== "string" && typeof startTime.fromTime !== "string" ? startTime.fromTime.minutes : 0),
  });
  const [selectedToTime, setSelectedToTime] = useState<PlayTime>({
    hours: Number(typeof startTime !== "string" && typeof startTime.toTime !== "string" ? startTime.toTime.hours : 0),
    minutes: Number(typeof startTime !== "string" && typeof startTime.toTime !== "string" ? startTime.toTime.minutes : 0),
  });

  const [selectedTime, setSelectedTime] = useState<PlayIf>({
    fromTime: typeof startTime !== "string" ? startTime.fromTime : "None",
    toTime: typeof startTime !== "string" ? startTime.toTime : "None",
  });

  const [isFromTimeSelected, setIsFromTimeSelected] = useState<boolean>(typeof startTime !== "string" && typeof startTime.fromTime !== "string" ? true : false);
  const [isToTimeSelected, setIsToTimeSelected] = useState<boolean>(typeof startTime !== "string" && typeof startTime.toTime !== "string" ? true : false);

  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  const selectTimeHandler = (e: React.ChangeEvent<HTMLSelectElement>, isItFromTime: boolean) => {
    const boolValue = Boolean(Number(e.target.value));

    if (isItFromTime) {
      if (boolValue) setSelectedTime({ ...selectedTime, fromTime: selectedFromTime });
      else setSelectedTime({ ...selectedTime, fromTime: "None" });
      setIsFromTimeSelected(boolValue);
      console.log(boolValue);
    } else {
      if (boolValue) setSelectedTime({ ...selectedTime, toTime: selectedToTime });
      else setSelectedTime({ ...selectedTime, toTime: "None" });
      setIsToTimeSelected(boolValue);
    }
  };

  const changeTimeHandler = (e: React.ChangeEvent<HTMLSelectElement>, isItFromTime: boolean, isItHours: boolean) => {
    const eValue: number = Number(e.target.value);

    if (isItFromTime) {
      if (isItHours) setSelectedFromTime({ ...selectedFromTime, hours: eValue });
      else setSelectedFromTime({ ...selectedFromTime, minutes: eValue });
    } else {
      if (isItHours) setSelectedToTime({ ...selectedToTime, hours: eValue });
      else setSelectedToTime({ ...selectedToTime, minutes: eValue });
    }
  };

  const updateTimeHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setDisableButton(true);
    setShowModal(false);

    const newTime: PlayIf = { fromTime: isFromTimeSelected ? selectedFromTime : "None", toTime: isToTimeSelected ? selectedToTime : "None" };

    let editedAvailability: CanPlay[] = player.canPlay;
    editedAvailability[timeIndex] = newTime;

    console.log(newTime);

    const editedPlayer: Player = { ...player, canPlay: editedAvailability };
    console.log(editedPlayer.canPlay);

    //TODO: UNLOCK!
    updatePlayerGroup(gameId, editedPlayer);
  };

  return (
    <div className="flex flex-col items-center">
      {createPortal(
        <div className={`${showModal ? "flex" : "hidden"} bg-slate-900 bg-opacity-60 fixed top-0 left-0 w-screen h-screen z-1 items-center justify-center`}>
          <form onSubmit={(e) => updateTimeHandler(e)} className="flex bg-stone-400 w-[20rem] h-[25rem] justify-center rounded-md relative">
            <div className="flex flex-col gap-8 items-center p-8">
              <div>
                <h4 className="font-bold text-lg">Change Time</h4>
              </div>
              <fieldset className="flex flex-col">
                <legend className="text-center mb-2">From</legend>
                <select
                  defaultValue={isFromTimeSelected ? "Set..." : "None"}
                  onChange={(e) => {
                    selectTimeHandler(e, true);
                    setDisableButton(false);
                  }}
                >
                  <option value={0}>None</option>
                  <option value={1}>Set...</option>
                </select>
                {isFromTimeSelected && (
                  <div className="mt-4">
                    <select
                      className="mr-4"
                      defaultValue={selectedFromTime.hours}
                      onChange={(e) => {
                        changeTimeHandler(e, true, true);
                        setDisableButton(false);
                      }}
                    >
                      {startAtHours.map((sH, index) => (
                        <option key={player.id + "sH" + index} value={sH}>
                          {sH}
                        </option>
                      ))}
                    </select>
                    <select
                      defaultValue={selectedFromTime.minutes}
                      onChange={(e) => {
                        changeTimeHandler(e, true, false);
                        setDisableButton(false);
                      }}
                    >
                      {startAtMinutes.map((sM, index) => (
                        <option key={player.id + "sM" + index} value={sM}>
                          {sM}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </fieldset>
              <fieldset className="flex flex-col">
                <legend className="text-center mb-2">To</legend>
                <select
                  defaultValue={isToTimeSelected ? "Set..." : "None"}
                  onChange={(e) => {
                    selectTimeHandler(e, false);
                    setDisableButton(false);
                  }}
                >
                  <option value={0}>None</option>
                  <option value={1}>Set...</option>
                </select>
                {isToTimeSelected && (
                  <div className="mt-4">
                    <select
                      className="mr-4"
                      defaultValue={selectedToTime.hours}
                      onChange={(e) => {
                        changeTimeHandler(e, false, true);
                        setDisableButton(false);
                      }}
                    >
                      {startAtHours.map((sH, index) => (
                        <option key={player.id + "sH" + index} value={sH}>
                          {sH}
                        </option>
                      ))}
                    </select>
                    <select
                      defaultValue={selectedToTime.minutes}
                      onChange={(e) => {
                        changeTimeHandler(e, false, false);
                        setDisableButton(false);
                      }}
                    >
                      {startAtMinutes.map((sM, index) => (
                        <option key={player.id + "sM" + index} value={sM}>
                          {sM}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </fieldset>
              <div className="flex gap-12 absolute bottom-8">
                <button type="submit" disabled={disableButton} className={`px-3 py-1 rounded-md ${disableButton ? "bg-slate-500" : "bg-indigo-500"}`}>
                  Save
                </button>
                <button type="button" className="px-3 py-1 rounded-md bg-rose-500" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>,
        document.body
      )}
      <button type="button">
        <FaEdit size={20} onClick={() => setShowModal(true)} className="mt-2 mb-2 cursor-pointer hover:text-violet-600" />
      </button>
      <div className="flex flex-col items-center">
        {typeof startTime !== "string" && typeof startTime.fromTime !== "string" && (
          <span className="text-sm text-center">{`From ${startTime.fromTime.hours}:${startTime.fromTime.minutes === 0 ? startTime.fromTime.minutes + "0" : startTime.fromTime.minutes}`}</span>
        )}
        {typeof startTime !== "string" && typeof startTime.toTime !== "string" && (
          <span className="text-sm text-center">{`To ${startTime.toTime.hours}:${startTime.toTime.minutes === 0 ? startTime.toTime.minutes + "0" : startTime.toTime.minutes}`}</span>
        )}
      </div>
    </div>
  );
};

export default TimeSelection;
