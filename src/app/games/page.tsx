"use client";

import { useState, useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, getFirestore } from "firebase/firestore";
import { app } from "@firebase/config";
import styles from "@styles/gametable.module.css";
import { v4 } from "uuid";
import getWeekDates from "@lib/getWeekDates";
import { addToGames } from "@firebase/games";
import { addPlayerGroup, updatePlayerGroup } from "@firebase/player-group";
import GameTable from "@components/GameTable";

type PlayerForm = {
  visible: boolean;
  id: string;
};

// const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const playerInitial: Player = {
  id: "",
  name: "",
  isDm: false,
  canPlay: ["Maybe", "Maybe", "Maybe", "Maybe", "Maybe", "Maybe", "Maybe"],
};
const newGameInitial: Game = {
  id: "",
  title: "",
  type: "DnD",
  dmName: "",
  notes: "",
  dates: getWeekDates(),
};
const playerFormInitial: PlayerForm = {
  visible: false,
  id: "",
};

const GamesPage = () => {
  const currentDay = new Date();
  const currentDayFormat: string = `${currentDay.getFullYear()}-${currentDay.getMonth() + 1}-${currentDay.getDate()}`;

  const [today, setToday] = useState<number>(0);

  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [playerFormVisible, setPlayerFormVisible] = useState<PlayerForm>(playerFormInitial);
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
    setFormVisible(false);
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
    setPlayerFormVisible(playerFormInitial);

    updatePlayerGroup(gameId, player);
  };

  return (
    <>
      <h1>Games</h1>
      <section className="flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center w-full gap-28">
          {gameError && <strong>Error: {JSON.stringify(gameError)}</strong>}
          {gameLoading && <span>Loading Games...</span>}
          {gameValue &&
            gameValue.docs
              .sort((a, b) => (a.data().dates[0] > b.data().dates[0] ? 1 : -1))
              .map((gm) => (
                <GameTable
                  key={gm.data().id}
                  gm={gm}
                  today={today}
                  playersValue={playersValue}
                  playerFormVisible={playerFormVisible}
                  setPlayerFormVisible={setPlayerFormVisible}
                  addNewPlayer={addNewPlayer}
                  setFormVisible={setFormVisible}
                  playerFormInitial={playerFormInitial}
                />
              ))}
        </div>
        <div>
          {formVisible ? (
            <form onSubmit={(e) => addNewGame(e)}>
              <div>
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
                <input type="text" id="gameNotes" placeholder="e.g. Ne felejtsetek el lootolni!" onChange={(e) => setNewGame((prev) => ({ ...prev, notes: e.target.value.trim() }))} />
                <label htmlFor="gameDate">Start Date</label>
                <input type="date" id="gameDate" name="session-start" onChange={(e) => setNewGame({ ...newGame, dates: getWeekDates(e.target.value) })} defaultValue={currentDayFormat} />
              </div>
              <div>
                <button type="submit">Save</button>
                <button
                  type="button"
                  onClick={() => {
                    setFormVisible(false);
                    setPlayerName("");
                  }}
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
                  setFormVisible(true);
                  setPlayerFormVisible(playerFormInitial);
                }}
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
