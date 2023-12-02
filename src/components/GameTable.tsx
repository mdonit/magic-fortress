import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import React, { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { FaCrown, FaEdit } from "react-icons/fa";
import { v4 } from "uuid";

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
  const [editName, setEditName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEdit]);

  const editPlayerHandler = (e: React.FormEvent<HTMLFormElement>, gameId: string, player: Player) => {
    e.preventDefault();
    const editedPlayer: Player = { ...player, name: editName };

    addNewPlayer(e, gameId, editedPlayer);

    setIsEdit(isEditNameInit);
    setEditName("");
    setNewPlayer(playerInitial);
  };

  return (
    <div className="bg-slate-400">
      <div className="flex justify-center flex-col items-center">
        <h2>{gm.data().title}</h2>
        <h3>{gm.data().type}</h3>
      </div>
      <div>
        <ul className="grid grid-cols-8">
          <li></li>
          {dayNames.map((day, index) => (
            <li key={gm.data().id + index} className={today === index ? "font-bold" : ""}>{`${day} (${gm.data().dates[index]})`}</li>
          ))}
        </ul>
        {/* {playersError && <strong>Error: {JSON.stringify(playersError)}</strong>}
        {playersLoading && <span>Loading Players...</span>} */}
        {playersValue &&
          playersValue.docs
            .filter((gp) => gp.data().gameId === gm.data().id)[0]
            .data()
            .players.map((pl: Player) => (
              <ul className="grid grid-cols-8" key={pl.id}>
                {isEdit.isEditing && isEdit.editId === pl.id ? (
                  <form onSubmit={(e) => editPlayerHandler(e, gm.data().id, newPlayer)}>
                    <input
                      ref={inputRef}
                      type="text"
                      value={editName}
                      onChange={(e) => {
                        setEditName(e.target.value);
                      }}
                    />
                  </form>
                ) : (
                  <li className="flex gap-2">
                    {pl.isDm && <FaCrown size={20} />} {pl.name}{" "}
                    <FaEdit
                      size={20}
                      onClick={() => {
                        setEditName(pl.name);
                        setNewPlayer({ id: pl.id, name: pl.name, canPlay: pl.canPlay, isDm: pl.isDm });
                        setIsEdit({ isEditing: true, editId: pl.id });
                      }}
                    />
                  </li>
                )}
                {pl.canPlay.map((cp, index) => (
                  <li key={pl.id + index}>{cp}</li>
                ))}
              </ul>
            ))}
        {playerFormVisible.visible && playerFormVisible.id === gm.data().id ? (
          <form
            onSubmit={(e) => {
              addNewPlayer(e, gm.data().id, newPlayer);
              setNewPlayer(playerInitial);
            }}
          >
            <input type="text" placeholder="Player Name" onChange={(e) => setNewPlayer((prev) => ({ ...prev, name: e.target.value.trim() }))} />
            <button type="submit">Save</button>
            <button
              type="button"
              onClick={() => {
                setPlayerFormVisible(playerFormInitial);
                setNewPlayer(playerInitial);
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              setPlayerFormVisible({ visible: true, id: gm.data().id });
              setFormVisible(false);
              setNewPlayer(playerInitial);
            }}
          >
            Add Player
          </button>
        )}
      </div>
    </div>
  );
};

export default GameTable;
