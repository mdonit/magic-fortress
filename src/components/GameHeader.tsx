import { deleteFromGames, updateGame } from "@firebase/games";
import { deletePlayerGroup } from "@firebase/player-group";
import React, { useState, useRef, useEffect } from "react";
import { MdDone, MdDelete, MdClose, MdEdit } from "react-icons/md";

type GameData = {
  startAt: PlayTime;
  title: string;
  type: string;
  docId: string;
  gameId: string;
  notes: string;
};

type IsEditContent = {
  isEditing: boolean;
  editId: string;
};

const isEditContentInit: IsEditContent = {
  isEditing: false,
  editId: "",
};

const startAtHours: number[] = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
const startAtMinutes: number[] = [0, 15, 30, 45];

const GameHeader = ({ startAt, title, type, docId, gameId, notes }: GameData) => {
  const [isEditContent, setIsEditContent] = useState<IsEditContent>(isEditContentInit);
  const [editTime, setEditTime] = useState<PlayTime>(startAt);
  const [editTitle, setEditTitle] = useState<string>(title);
  const [editType, setEditType] = useState<string>(type);
  const [editNotes, setEditNotes] = useState<string>(notes);

  const deleteGameHandler = (gameDocId: string, gameId: string) => {
    deleteFromGames(gameDocId);
    deletePlayerGroup(gameId);
  };

  const changeGameDetails = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsEditContent(isEditContentInit);
    updateGame(docId, editTitle, editType, editTime, editNotes);
  };

  return (
    <div className="grid grid-cols-2">
      <div className="flex justify-start gap-8">
        {isEditContent.isEditing && isEditContent.editId === gameId ? (
          <form className="flex gap-2" onSubmit={(e) => changeGameDetails(e)}>
            <div>
              <div>
                <label htmlFor="editTitle">Title</label>
                <input type="text" id="editTitle" required placeholder="e.g. Lost Mines of Magic Fortress" defaultValue={title} onChange={(e) => setEditTitle(e.target.value.trim())} />
              </div>
              <div>
                <label htmlFor="editType">Type</label>
                <input type="text" id="editType" required placeholder="e.g. DnD, BitD" defaultValue={type} onChange={(e) => setEditType(e.target.value.trim())} />
              </div>
              <fieldset>
                <legend>Start Time</legend>
                <label htmlFor="editHours">Hours</label>
                <select id="editHours" defaultValue={startAt.hours} onChange={(e) => setEditTime((prev) => ({ hours: Number(e.target.value), minutes: prev.minutes }))}>
                  {startAtHours.map((sH) => (
                    <option key={sH + "hour"} value={sH}>
                      {sH}
                    </option>
                  ))}
                </select>
                <label htmlFor="editMinutes">Minutes</label>
                <select id="editMinutes" defaultValue={startAt.minutes} onChange={(e) => setEditTime((prev) => ({ hours: prev.hours, minutes: Number(e.target.value) }))}>
                  {startAtMinutes.map((sM) => (
                    <option key={sM + "min"} value={sM}>
                      {sM}
                    </option>
                  ))}
                </select>
              </fieldset>
            </div>
            <div>
              <label htmlFor="editNotes">Notes</label>
              <input type="text" id="editNotes" defaultValue={notes} onChange={(e) => setEditNotes(e.target.value.trim())} />
            </div>
            <div className="flex items-start gap-4">
              <button type="submit">
                <MdDone size={35} />
              </button>
              <button type="button" onClick={() => setIsEditContent(isEditContentInit)}>
                <MdClose size={35} />
              </button>
            </div>
          </form>
        ) : (
          <>
            <div>
              <h2>{title}</h2>
              <h3>{type}</h3>
              <h4>
                {startAt.hours}:{startAt.minutes === 0 ? startAt.minutes + "0" : startAt.minutes}
              </h4>
            </div>
            <div>
              <p>{notes}</p>
            </div>
          </>
        )}
      </div>
      <div className="top-2 right-2 absolute flex gap-4 items-center">
        {!isEditContent.isEditing && (
          <button type="button">
            <MdEdit size={30} onClick={() => setIsEditContent({ isEditing: true, editId: gameId })} />
          </button>
        )}
        <button type="button">
          <MdDelete size={30} onClick={() => deleteGameHandler(docId, gameId)} />
        </button>
      </div>
    </div>
  );
};

export default GameHeader;
