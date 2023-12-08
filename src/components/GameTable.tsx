// import { deleteFromGames } from "@firebase/games";
import { updatePlayerGroup, deletePlayerFromGroup, deletePlayerGroup } from "@firebase/player-group";
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import React, { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { FaCrown, FaEdit } from "react-icons/fa";
import { MdDone, MdDelete, MdClose } from "react-icons/md";
import TimeSelection from "./TimeSelection";
import GameHeader from "./GameHeader";

type PlayerForm = {
  visible: boolean;
  id: string;
};

type TimeTable = {
  gm: QueryDocumentSnapshot<DocumentData, DocumentData>;
  today: number;
  playersValue: QuerySnapshot<DocumentData, DocumentData> | undefined;
  playerFormVisible: PlayerForm;
  playerFormInitial: PlayerForm;
  setPlayerFormVisible: Dispatch<SetStateAction<PlayerForm>>;
  addNewPlayer: (e: React.FormEvent<HTMLFormElement>, gameId: string, player: Player) => void;
  setFormVisible: Dispatch<SetStateAction<boolean>>;
  playerInitial: Player;
};

type IsEditContent = {
  isEditing: boolean;
  editId: string;
};

const isEditContentInit: IsEditContent = {
  isEditing: false,
  editId: "",
};

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const GameTable = ({ gm, today, playersValue, playerFormVisible, setPlayerFormVisible, addNewPlayer, setFormVisible, playerFormInitial, playerInitial }: TimeTable) => {
  const [newPlayer, setNewPlayer] = useState<Player>(playerInitial);
  const [isNameInput, setIsNameInput] = useState<boolean>(false);

  const [isEditName, setIsEditName] = useState<IsEditContent>(isEditContentInit);
  const [editName, setEditName] = useState<string>("");
  const editNameRef = useRef<HTMLInputElement>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editNameRef.current?.focus();
  }, [isEditName]);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, [isNameInput]);

  const editAvailabilityHandler = (e: React.ChangeEvent<HTMLSelectElement>, gameId: string, index: number, player: Player) => {
    e.preventDefault();

    const checkOption: string = e.target.value;
    let chosenOption;
    let timeOption: PlayTime = { hours: 20, minutes: 30 };

    if (checkOption === "If") {
      chosenOption = timeOption;
    } else chosenOption = e.target.value;

    let editedAvailability: CanPlay[] = player.canPlay;
    editedAvailability[index] = chosenOption as CanPlay;

    const editedPlayer: Player = { ...player, canPlay: editedAvailability };

    updatePlayerGroup(gameId, editedPlayer);
  };

  const editNameHandler = (e: React.FormEvent<HTMLFormElement>, gameId: string, player: Player) => {
    e.preventDefault();
    const editedPlayer: Player = { ...player, name: editName };

    addNewPlayer(e, gameId, editedPlayer);

    setIsEditName(isEditContentInit);
    setEditName("");
    setNewPlayer(playerInitial);
  };

  const deletePlayerHandler = (gameId: string, playerId: string) => {
    deletePlayerFromGroup(gameId, playerId);
  };

  return (
    <div className="bg-slate-400 rounded-lg p-4 text-lg relative">
      <GameHeader startAt={gm.data().startAt} title={gm.data().title} type={gm.data().type} docId={gm.id} gameId={gm.data().id} notes={gm.data().notes} />

      <div>
        <ul className="grid grid-cols-8">
          <li></li>
          {dayNames.map((day, index) => (
            <li key={gm.data().id + index} className={today === index ? "font-bold flex justify-center pb-3" : "flex justify-center pb-3"}>{`${day} (${gm.data().dates[index]})`}</li>
          ))}
        </ul>
        {playersValue &&
          playersValue.docs
            .filter((gp) => gp.data().gameId === gm.data().id)[0]
            .data()
            .players.sort((a: Player, b: Player) => (a.name > b.name ? 1 : -1))
            .map((pl: Player) => (
              <ul className="grid grid-cols-8 py-2 my-1 items-center justify-center" key={pl.id}>
                {isEditName.isEditing && isEditName.editId === pl.id ? (
                  <li className="flex gap-4 justify-end pr-4">
                    <form className="flex items-center gap-4" onSubmit={(e) => editNameHandler(e, gm.data().id, pl)}>
                      <input
                        ref={editNameRef}
                        className="w-20"
                        type="text"
                        value={editName}
                        onChange={(e) => {
                          setEditName(e.target.value);
                        }}
                      />
                      <button type="submit">
                        <MdDone size={30} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditName(isEditContentInit);
                          setEditName("");
                          setNewPlayer(playerInitial);
                        }}
                      >
                        <MdClose size={30} />
                      </button>
                    </form>
                  </li>
                ) : (
                  <li className="flex gap-4 items-center justify-end pr-4">
                    {pl.isDm && <FaCrown size={20} />} {pl.name}
                    <FaEdit
                      size={25}
                      onClick={() => {
                        setEditName(pl.name);
                        setNewPlayer({ id: pl.id, name: pl.name, canPlay: pl.canPlay, isDm: pl.isDm });
                        setIsEditName({ isEditing: true, editId: pl.id });
                        setPlayerFormVisible(playerFormInitial);
                        setNewPlayer(playerInitial);
                        setIsNameInput(false);
                      }}
                    />
                    <MdDelete size={25} onClick={() => deletePlayerHandler(gm.data().id, pl.id)} />
                  </li>
                )}
                {pl.canPlay.map((cp, index) => (
                  <li key={pl.id + index} className="flex justify-center gap-2 flex-col">
                    <div className="flex justify-center gap-4">
                      <select onChange={(e) => editAvailabilityHandler(e, gm.data().id, index, pl)} defaultValue={typeof cp !== "string" ? "If" : cp.toString()}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="If">If...</option>
                      </select>
                      {typeof cp !== "string" && <TimeSelection player={pl} gameId={gm.data().id} timeIndex={index} />}
                    </div>
                    {typeof cp !== "string" && <span>{`${cp.hours}:${cp.minutes === 0 ? cp.minutes + "0" : cp.minutes}`}</span>}
                  </li>
                ))}
              </ul>
            ))}
        {playerFormVisible.visible && playerFormVisible.id === gm.data().id ? (
          <form
            onSubmit={(e) => {
              addNewPlayer(e, gm.data().id, newPlayer);
              setNewPlayer(playerInitial);
              setIsNameInput(false);
            }}
            className="flex items-center gap-3 px-3 py-1 mt-7 rounded-md"
          >
            <input ref={nameInputRef} required type="text" placeholder="Player Name" onChange={(e) => setNewPlayer((prev) => ({ ...prev, name: e.target.value.trim() }))} />
            <button type="submit">
              <MdDone size={30} />
            </button>
            <button
              type="button"
              onClick={() => {
                setPlayerFormVisible(playerFormInitial);
                setNewPlayer(playerInitial);
                setIsNameInput(false);
              }}
            >
              <MdClose size={30} />
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              setPlayerFormVisible({ visible: true, id: gm.data().id });
              setFormVisible(false);
              setNewPlayer(playerInitial);
              setIsEditName(isEditContentInit);
              setIsNameInput(true);
            }}
            className="px-3 py-1 mt-7 rounded-md bg-orange-400"
          >
            Add Player
          </button>
        )}
      </div>
    </div>
  );
};

export default GameTable;
