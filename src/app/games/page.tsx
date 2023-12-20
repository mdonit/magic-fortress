"use client";

import { useState, useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, getFirestore } from "firebase/firestore";
import { app } from "@firebase/config";
import { v4 } from "uuid";
import getWeekDates from "@lib/getWeekDates";
import { addToGames } from "@firebase/games";
import { addPlayerGroup, updatePlayerGroup } from "@firebase/player-group";
import GameTable from "@components/GameTable";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const startAtHours: number[] = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
const startAtMinutes: number[] = [0, 15, 30, 45];

const playerInitial: Player = {
  id: "",
  name: "",
  isDm: false,
  canPlay: ["No", "No", "No", "No", "No", "No", "No"],
};
const newGameInitial: Game = {
  id: "",
  title: "",
  type: "DnD",
  notes: "",
  startAt: { hours: 20, minutes: 30 },
  dates: getWeekDates(),
  timestamp: 0,
};

const GamesPage = () => {
  const currentDay = new Date();
  const currentDayFormat: string = `${currentDay.getFullYear()}-${currentDay.getMonth() + 1}-${currentDay.getDate()}`;
  const [today, setToday] = useState<number>(0);

  const [gameFormVisible, setGameFormVisible] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>("");
  const [newGame, setNewGame] = useState<Game>(newGameInitial);

  const [gameValue, gameLoading, gameError] = useCollection(collection(getFirestore(app), "games"), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [playersValue] = useCollection(collection(getFirestore(app), "playergroup"), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  useEffect(() => {
    setToday(new Date().getDay() - 1);
  }, []);

  const addNewGame = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGameFormVisible(false);
    const gameId = v4();
    const gameReady: Game = { ...newGame, id: gameId };
    const gameDm: Player = { ...playerInitial, isDm: true, name: playerName, id: v4() };

    addToGames(gameReady);
    addPlayerGroup(gameId, gameDm);

    setPlayerName("");
    setNewGame(newGameInitial);
  };

  const addNewPlayer = (e: React.FormEvent<HTMLFormElement>, gameId: string, player: Player) => {
    e.preventDefault();
    updatePlayerGroup(gameId, player);
  };
  //className={`flex flex-col ${gameValue && gameValue.docs.length > 0 && "overflow-scroll"}`}
  return (
    <>
      {gameLoading && (
        <div>
          <span className="flex items-center gap-2 text-xl">
            Loading Games... <AiOutlineLoading3Quarters className="text-rose-500 animate-spin" size={30} />
          </span>
        </div>
      )}
      <section className={`flex flex-col ${gameValue && gameValue.docs.length > 0 && "mobile-scroll"}`}>
        <h1 className={`text-[1.5rem] block ${gameLoading && "hidden"}`}>Game List</h1>
        <div className="flex gap-8 mb-8">
          {gameValue &&
            gameValue.docs.length >= 3 &&
            gameValue.docs
              .sort((a, b) => (a.data().timestamp > b.data().timestamp ? 1 : -1))
              .map((gm, index) => (
                <button type="button" key={"gameLink" + index} className="hover:text-indigo-600">
                  <a href={`#game${index}`}>
                    Game #{index + 1}: {gm.data().title}
                  </a>
                </button>
              ))}
        </div>
        <div className={`grid grid-cols-1 gap-8 ${gameValue && gameValue.docs.length > 1 && "xl:grid-cols-2"}`}>
          {gameError && <strong>Error: {JSON.stringify(gameError)}</strong>}
          {gameValue &&
            gameValue.docs
              .sort((a, b) => (a.data().timestamp > b.data().timestamp ? 1 : -1))
              .map((gm, index) => (
                <GameTable
                  key={gm.data().id}
                  elementId={index}
                  gm={gm}
                  today={today}
                  playersValue={playersValue}
                  addNewPlayer={addNewPlayer}
                  setFormVisible={setGameFormVisible}
                  playerInitial={playerInitial}
                  currentDayFormat={currentDayFormat}
                />
              ))}
        </div>
        {gameValue && gameValue.docs.length >= 3 && (
          <span className="flex justify-center">
            <button type="button" className="hover:text-indigo-600 block mt-4">
              <a href="#">Back to Top</a>
            </button>
          </span>
        )}
        <div className="flex justify-center">
          {gameFormVisible ? (
            <form onSubmit={(e) => addNewGame(e)} className="flex flex-col mt-16">
              <div className="grid grid-cols-2 gap-4">
                <label htmlFor="gameTitle">Game Title</label>
                <input type="text" id="gameTitle" placeholder="e.g. Lost Mines of Magic Fortress" required onChange={(e) => setNewGame((prev) => ({ ...prev, title: e.target.value.trim() }))} />
                <label htmlFor="gameType">Game Type</label>
                <input type="text" id="gameType" placeholder="e.g. DnD, BitD" defaultValue={"DnD"} required onChange={(e) => setNewGame((prev) => ({ ...prev, type: e.target.value.trim() }))} />
                <label htmlFor="gameDm">DM</label>
                <input
                  type="text"
                  id="gameDm"
                  placeholder="e.g. Matt Mercer"
                  required
                  onChange={(e) => {
                    setPlayerName(e.target.value.trim());
                    setNewGame((prev) => ({ ...prev, dmName: e.target.value.trim() }));
                  }}
                />
                <label htmlFor="gameNotes">Notes</label>
                <input type="text" id="gameNotes" placeholder="e.g. grab food and drinks!" onChange={(e) => setNewGame((prev) => ({ ...prev, notes: e.target.value.trim() }))} />
                <label htmlFor="gameDate">Start Date</label>
                <input type="date" id="gameDate" name="session-start" onChange={(e) => setNewGame({ ...newGame, dates: getWeekDates(e.target.value) })} defaultValue={currentDayFormat} />
                <span>Start Time</span>
                <fieldset className="flex items-center gap-2">
                  <legend className="hidden">Start Time</legend>
                  <label htmlFor="gameHours">Hours</label>
                  <select id="gameHours" defaultValue={20} onChange={(e) => setNewGame((prev) => ({ ...prev, startAt: { hours: Number(e.target.value), minutes: prev.startAt.minutes } }))}>
                    {startAtHours.map((sH) => (
                      <option key={sH + "hour"} value={sH}>
                        {sH}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="gameMinutes">Minutes</label>
                  <select id="gameMinutes" defaultValue={30} onChange={(e) => setNewGame((prev) => ({ ...prev, startAt: { hours: prev.startAt.hours, minutes: Number(e.target.value) } }))}>
                    {startAtMinutes.map((sM) => (
                      <option key={sM + "min"} value={sM}>
                        {sM}
                      </option>
                    ))}
                  </select>
                </fieldset>
              </div>
              <div className="flex gap-4 mt-4 mb-7 justify-center">
                <button type="submit" className="px-3 py-1 mt-4 rounded-md bg-indigo-400">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGameFormVisible(false);
                    setPlayerName("");
                  }}
                  className="px-3 py-1 mt-4 rounded-md bg-rose-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            gameValue && (
              <button
                type="button"
                onClick={() => {
                  setGameFormVisible(true);
                }}
                className="px-3 py-1 m-7 rounded-md bg-rose-400"
              >
                ADD NEW GAME
              </button>
            )
          )}
        </div>
      </section>
    </>
  );
};

export default GamesPage;
