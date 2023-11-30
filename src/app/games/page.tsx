"use client";

import { useState, useEffect, JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, getFirestore } from "firebase/firestore";
import { app } from "@firebase/config";
import styles from "@styles/gametable.module.css";
import { v4 } from "uuid";
import getWeekDates from "@lib/getWeekDates";
import { addToGames } from "@firebase/games";
import { addPlayerGroup } from "@firebase/player-group";

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const playerInitial: Player = {
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
  dates: [],
};

const DndPage = () => {
  const currentDay = new Date();

  const currentDayFormat: string = `${currentDay.getFullYear()}-${currentDay.getMonth() + 1}-${currentDay.getDate()}`;
  const [today, setToday] = useState<number>(0);

  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(playerInitial);
  const [newGame, setNewGame] = useState<Game>(newGameInitial);

  const [gameValue, gameLoading, gameError] = useCollection(collection(getFirestore(app), "games"), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [playersValue, playersLoading, playersError] = useCollection(collection(getFirestore(app), "playergroup"), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  useEffect(() => {
    setToday(new Date().getDay() - 1);

    setNewGame({ ...newGame, dates: getWeekDates() });
  }, []);

  const addNewGame = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormVisible(false);
    const gameId = v4();
    const gameReady: Game = { ...newGame, id: gameId };
    const gameDm: Player = { ...currentPlayer, isDm: true };

    addToGames(gameReady);
    addPlayerGroup(gameId, gameDm);

    setCurrentPlayer(playerInitial);
    setNewGame(newGameInitial);
  };

  return (
    <>
      <h1>DnD</h1>
      <section className="flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center w-full bg-slate-400">
          {gameError && <strong>Error: {JSON.stringify(gameError)}</strong>}
          {gameLoading && <span>Loading Games...</span>}
          {gameValue &&
            gameValue.docs.map((gm) => (
              <>
                <div className="flex justify-center flex-col items-center">
                  <h2>{gm.data().title}</h2>
                  <h3>{gm.data().type}</h3>
                </div>
                <div>
                  <ul className="grid grid-cols-8">
                    <li></li>
                    {dayNames.map((day, index) => (
                      <li key={v4()} className={today === index ? "font-bold" : ""}>
                        {`${day} (${gm.data().dates[index]})`}
                      </li>
                    ))}
                  </ul>
                  {playersError && <strong>Error: {JSON.stringify(playersError)}</strong>}
                  {playersLoading && <span>Loading Players...</span>}
                  {playersValue &&
                    playersValue.docs
                      .filter((gp) => gp.data().gameId === gm.data().id)[0]
                      .data()
                      .players.map((pl: Player) => (
                        <ul className="grid grid-cols-8">
                          <li key={v4()}>
                            {pl.isDm && "DM-"} {pl.name}
                          </li>
                          {pl.canPlay.map((cp) => (
                            <li key={v4()}>{cp}</li>
                          ))}
                        </ul>
                      ))}
                  {/* {playersValue &&
                    playersValue.docs.map((gp) =>
                      gp.data().players.map((pl: Player) => (
                        <ul className="grid grid-cols-8">
                          <li>
                            {pl.isDm && "DM-"} {pl.name}
                          </li>
                          {pl.canPlay.map((cp) => (
                            <li>{cp}</li>
                          ))}
                        </ul>
                      ))
                    )} */}
                </div>
              </>
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
                    setCurrentPlayer((prev) => ({ ...prev, name: e.target.value.trim() }));
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
                <button type="button" onClick={() => setFormVisible(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button type="button" onClick={() => setFormVisible(true)}>
              CLICK HERE
            </button>
          )}
        </div>
      </section>
    </>
  );
};

export default DndPage;
