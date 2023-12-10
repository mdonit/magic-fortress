import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { fireStoreDb } from "./config";

const collectionPath = "games";

export const addToGames = async (newGame: Game) => {
  const newTimestamp = Date.now();

  const addedGame: Game = {
    id: newGame.id,
    title: newGame.title,
    type: newGame.type,
    notes: newGame.notes,
    dates: newGame.dates,
    startAt: newGame.startAt,
    timestamp: newTimestamp,
  };
  await addDoc(collection(fireStoreDb, collectionPath), addedGame);
};

export const updateGame = async (docId: string, title: string, type: string, startAt: PlayTime, notes: string) => {
  const gameRef = doc(fireStoreDb, collectionPath, docId);
  await updateDoc(gameRef, { title, type, startAt, notes });
};

export const deleteFromGames = async (id: string) => {
  await deleteDoc(doc(fireStoreDb, collectionPath, id));
};

export const getFromGames = async () => {
  return await getDocs(collection(fireStoreDb, collectionPath));
};
