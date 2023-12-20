import { deleteFromGames, updateGame } from "@firebase/games";
import { deletePlayerGroup } from "@firebase/player-group";
import React, { useState, useRef, useEffect } from "react";
import { MdDone, MdDelete, MdClose } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

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
    <div className="mb-4">
      <div className="flex mt-8">
        <div className="flex justify-start gap-8">
          {isEditContent.isEditing && isEditContent.editId === gameId ? (
            <form className="flex flex-col gap-4" onSubmit={(e) => changeGameDetails(e)}>
              <div className="flex flex-col gap-4">
                <div className="flex gap-6">
                  <label htmlFor="editTitle">Title</label>
                  <input type="text" id="editTitle" required placeholder="e.g. Lost Mines of Magic Fortress" defaultValue={title} onChange={(e) => setEditTitle(e.target.value.trim())} />
                </div>
                <div className="flex gap-6">
                  <label htmlFor="editType">Type</label>
                  <input type="text" id="editType" required placeholder="e.g. DnD, BitD" defaultValue={type} onChange={(e) => setEditType(e.target.value.trim())} />
                </div>
                <fieldset className="flex gap-4 items-center">
                  <legend className="hidden">Start Time</legend>
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
              <div className="flex gap-6 items-start">
                <label htmlFor="editNotes">Notes</label>
                <input type="text" id="editNotes" defaultValue={notes} onChange={(e) => setEditNotes(e.target.value.trim())} />
              </div>
              <div className="flex items-start gap-4">
                <button type="submit">
                  <MdDone size={35} className="hover:text-indigo-600" />
                </button>
                <button type="button" onClick={() => setIsEditContent(isEditContentInit)}>
                  <MdClose size={35} className="hover:text-red-600" />
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className=" flex flex-col gap-2">
                <h2>
                  <b>{title}</b>
                </h2>
                <h3>
                  <b>
                    {type} - {startAt.hours}:{startAt.minutes === 0 ? startAt.minutes + "0" : startAt.minutes}
                  </b>
                </h3>
              </div>
              <div className="break-all max-w-[20rem]">
                <p>{notes}</p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="top-2 right-2 absolute flex gap-4 items-center">
        {!isEditContent.isEditing && (
          <button type="button">
            <FaEdit size={30} onClick={() => setIsEditContent({ isEditing: true, editId: gameId })} className="hover:text-violet-600" />
          </button>
        )}
        <button type="button">
          <MdDelete size={30} onClick={() => deleteGameHandler(docId, gameId)} className="hover:text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default GameHeader;
