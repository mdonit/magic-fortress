import { deleteFromGames } from "@firebase/games";
import { updatePlayerGroup, deletePlayerFromGroup, deletePlayerGroup } from "@firebase/player-group";
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import React, { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { FaCrown, FaEdit } from "react-icons/fa";
import { MdDone, MdDelete, MdClose } from "react-icons/md";

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
};

type IsEditName = {
  isEditing: boolean;
  editId: string;
};

const isEditNameInit: IsEditName = {
  isEditing: false,
  editId: "",
};

const playerInitial: Player = {
  id: "",
  name: "",
  isDm: false,
  canPlay: ["Maybe", "Maybe", "Maybe", "Maybe", "Maybe", "Maybe", "Maybe"],
};

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const GameTable = ({ gm, today, playersValue, playerFormVisible, setPlayerFormVisible, addNewPlayer, setFormVisible, playerFormInitial }: TimeTable) => {
  const [newPlayer, setNewPlayer] = useState<Player>(playerInitial);
  const [isEdit, setIsEdit] = useState<IsEditName>(isEditNameInit);
  const [isNameInput, setIsNameInput] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [isEdit]);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, [isNameInput]);

  const editAvailabilityHandler = (e: React.ChangeEvent<HTMLSelectElement>, gameId: string, index: number, player: Player) => {
    e.preventDefault();

    let editedAvailability: CanPlay[] = player.canPlay;
    editedAvailability[index] = e.target.value as CanPlay;

    const editedPlayer: Player = { ...player, canPlay: editedAvailability };
    updatePlayerGroup(gameId, editedPlayer);
  };

  const editNameHandler = (e: React.FormEvent<HTMLFormElement>, gameId: string, player: Player) => {
    e.preventDefault();
    const editedPlayer: Player = { ...player, name: editName };

    addNewPlayer(e, gameId, editedPlayer);

    setIsEdit(isEditNameInit);
    setEditName("");
    setNewPlayer(playerInitial);
  };

  const deletePlayerHandler = (gameId: string, playerId: string) => {
    deletePlayerFromGroup(gameId, playerId);
  };
  const deleteGameHandler = (gameDocId: string, gameId: string) => {
    deleteFromGames(gameDocId);
    deletePlayerGroup(gameId);
  };

  return (
    <div className="bg-slate-400 rounded-lg p-4 text-lg relative">
      <div className="grid grid-cols-2">
        <div>
          <h2>{gm.data().title}</h2>
          <h3>{gm.data().type}</h3>
        </div>
        <div>
          <p>{gm.data().notes}</p>
        </div>
        <MdClose size={40} className="top-0 right-0 absolute" onClick={() => deleteGameHandler(gm.id, gm.data().id)} />
      </div>
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
                {isEdit.isEditing && isEdit.editId === pl.id ? (
                  <li className="flex gap-4 justify-end pr-4">
                    <form className="flex items-center gap-4" onSubmit={(e) => editNameHandler(e, gm.data().id, pl)}>
                      <input
                        ref={editInputRef}
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
                          setIsEdit(isEditNameInit);
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
                        setIsEdit({ isEditing: true, editId: pl.id });
                        setPlayerFormVisible(playerFormInitial);
                        setNewPlayer(playerInitial);
                        setIsNameInput(false);
                      }}
                    />
                    <MdDelete size={25} onClick={() => deletePlayerHandler(gm.data().id, pl.id)} />
                  </li>
                )}
                {pl.canPlay.map((cp, index) => (
                  <li key={pl.id + index} className="flex justify-center">
                    <select name="availability" onChange={(e) => editAvailabilityHandler(e, gm.data().id, index, pl)} defaultValue={cp}>
                      <option value="Maybe">Maybe</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
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
              setIsEdit(isEditNameInit);
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
