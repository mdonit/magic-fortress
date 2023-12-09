import { copyPlayerGroup, updatePlayerGroup, deletePlayerFromGroup } from "@firebase/player-group";
import { addToGames } from "@firebase/games";
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import React, { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDone, MdDelete, MdClose } from "react-icons/md";
import { LiaCrownSolid } from "react-icons/lia";
import TimeSelection from "./TimeSelection";
import GameHeader from "./GameHeader";
import getWeekDates from "@lib/getWeekDates";
import { v4 } from "uuid";

type TimeTable = {
  gm: QueryDocumentSnapshot<DocumentData, DocumentData>;
  today: number;
  playersValue: QuerySnapshot<DocumentData, DocumentData> | undefined;
  addNewPlayer: (e: React.FormEvent<HTMLFormElement>, gameId: string, player: Player) => void;
  setFormVisible: Dispatch<SetStateAction<boolean>>;
  playerInitial: Player;
  currentDayFormat: string;
};

type FormVisible = {
  visible: boolean;
  id: string;
};

type IsEditContent = {
  isEditing: boolean;
  editId: string;
};

const isFormVisibleInit: FormVisible = {
  visible: false,
  id: "",
};

const isEditContentInit: IsEditContent = {
  isEditing: false,
  editId: "",
};

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const GameTable = ({ gm, today, playersValue, addNewPlayer, setFormVisible, playerInitial, currentDayFormat }: TimeTable) => {
  const [newPlayer, setNewPlayer] = useState<Player>(playerInitial);
  const [isNameInput, setIsNameInput] = useState<boolean>(false);
  const [duplicateDates, setDuplicateDates] = useState<string[]>(getWeekDates());

  const [duplicateForm, setDuplicateForm] = useState<FormVisible>(isFormVisibleInit);
  const [playerFormVisible, setPlayerFormVisible] = useState<FormVisible>(isFormVisibleInit);

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

  const duplicatePlayerGroup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDuplicateForm(isFormVisibleInit);
    const newId: string = v4();

    const copiedGame: Game = {
      id: newId,
      title: gm.data().title,
      type: gm.data().type,
      notes: gm.data().notes,
      dates: duplicateDates,
      startAt: gm.data().startAt,
    };

    const copiedPlayerGroup: PlayerGroup = {
      gameId: newId,
      players: playersValue && playersValue.docs.filter((gp) => gp.data().gameId === gm.data().id)[0].data().players,
    };

    copyPlayerGroup(copiedPlayerGroup);
    addToGames(copiedGame);
  };

  return (
    <div className="bg-stone-400 rounded-lg p-4 text-lg relative border-l-8 border-rose-600">
      <GameHeader startAt={gm.data().startAt} title={gm.data().title} type={gm.data().type} docId={gm.id} gameId={gm.data().id} notes={gm.data().notes} />

      <div>
        <ul className="grid grid-cols-8">
          <li></li>
          {dayNames.map((day, index) => (
            <li key={gm.data().id + index} className={`flex justify-center pb-3 ${today === index && "font-bold flex justify-center pb-3"}`}>{`${day} (${gm.data().dates[index]})`}</li>
          ))}
        </ul>
        {playersValue &&
          playersValue.docs
            .filter((gp) => gp.data().gameId === gm.data().id)[0]
            .data()
            .players.sort((a: Player, b: Player) => (a.name > b.name ? 1 : -1))
            .map((pl: Player) => (
              <ul className="grid grid-cols-8 h-40 justify-center border-t-2 border-stone-500" key={pl.id}>
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
                        <MdDone size={30} className="hover:text-indigo-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditName(isEditContentInit);
                          setEditName("");
                          setNewPlayer(playerInitial);
                        }}
                      >
                        <MdClose size={30} className="hover:text-red-600" />
                      </button>
                    </form>
                  </li>
                ) : (
                  <li className="flex gap-4 items-center justify-end pr-4 border-r-2 border-stone-500">
                    {pl.isDm && (
                      <div>
                        <LiaCrownSolid size={35} className="bg-amber-300 rounded-full p-1" />
                      </div>
                    )}
                    <span className="text-xl">{pl.name}</span>
                    <button type="button">
                      <FaEdit
                        size={25}
                        onClick={() => {
                          setEditName(pl.name);
                          setNewPlayer({ id: pl.id, name: pl.name, canPlay: pl.canPlay, isDm: pl.isDm });
                          setIsEditName({ isEditing: true, editId: pl.id });
                          setPlayerFormVisible(isFormVisibleInit);
                          setNewPlayer(playerInitial);
                          setIsNameInput(false);
                        }}
                        className="hover:text-violet-600"
                      />
                    </button>
                    <button type="button">
                      <MdDelete size={25} onClick={() => deletePlayerHandler(gm.data().id, pl.id)} className="hover:text-red-600" />
                    </button>
                  </li>
                )}
                {pl.canPlay.map((cp, index) => (
                  <li key={pl.id + index} className={`flex justify-center gap-2 flex-col ${typeof cp !== "string" ? "bg-amber-300" : cp === "Yes" ? "bg-green-400" : "bg-red-400"}`}>
                    <div className="grid justify-center gap-2 items-center">
                      <select onChange={(e) => editAvailabilityHandler(e, gm.data().id, index, pl)} defaultValue={typeof cp !== "string" ? "If" : cp.toString()}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="If">If...</option>
                      </select>
                      {typeof cp !== "string" && <TimeSelection player={pl} gameId={gm.data().id} timeIndex={index} />}
                    </div>
                  </li>
                ))}
              </ul>
            ))}
        {playerFormVisible.visible && playerFormVisible.id === gm.data().id && (
          <form
            onSubmit={(e) => {
              addNewPlayer(e, gm.data().id, newPlayer);
              setNewPlayer(playerInitial);
              setIsNameInput(false);
              setPlayerFormVisible(isFormVisibleInit);
            }}
            className="flex items-center gap-3 px-3 py-1 mt-7 rounded-md"
          >
            <input
              ref={nameInputRef}
              required
              type="text"
              placeholder="Player Name"
              onChange={(e) => setNewPlayer((prev) => ({ ...prev, name: e.target.value.trim() }))}
              className="placeholder:text-stone-600"
            />
            <button type="submit">
              <MdDone size={30} className="hover:text-indigo-600" />
            </button>
            <button
              type="button"
              onClick={() => {
                setPlayerFormVisible(isFormVisibleInit);
                setNewPlayer(playerInitial);
                setIsNameInput(false);
              }}
            >
              <MdClose size={30} className="hover:text-red-600" />
            </button>
          </form>
        )}
        {duplicateForm.visible && duplicateForm.id === gm.data().id && (
          <form onSubmit={(e) => duplicatePlayerGroup(e)} className="flex items-center gap-3 px-3 py-1 mt-7 rounded-md">
            <label htmlFor="duplicateDate">Start Date</label>
            <input type="date" id="duplicateDate" name="session-copy" defaultValue={currentDayFormat} onChange={(e) => setDuplicateDates(getWeekDates(e.target.value))} />
            <button type="submit">
              <MdDone size={30} className="hover:text-indigo-600" />
            </button>
            <button
              type="button"
              onClick={() => {
                setDuplicateForm(isFormVisibleInit);
              }}
            >
              <MdClose size={30} className="hover:text-red-600" />
            </button>
          </form>
        )}
        {!duplicateForm.visible && duplicateForm.id !== gm.data().id && !playerFormVisible.visible && playerFormVisible.id !== gm.data().id && (
          <div className="mt-7 flex gap-7">
            <button
              type="button"
              onClick={() => {
                setPlayerFormVisible({ visible: true, id: gm.data().id });
                setFormVisible(false);
                setNewPlayer(playerInitial);
                setIsEditName(isEditContentInit);
                setIsNameInput(true);
              }}
              className="px-3 py-1 rounded-md bg-indigo-500"
            >
              Add Player
            </button>
            <button
              type="button"
              onClick={() => {
                setDuplicateForm({ visible: true, id: gm.data().id });
                setFormVisible(false);
              }}
              className="px-3 py-1 rounded-md bg-amber-500"
            >
              Duplicate Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameTable;
