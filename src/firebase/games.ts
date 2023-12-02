import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { fireStoreDb } from "./config";

const collectionPath = "games";

export const addToGames = async (newGame: Game) => {
  // const dateNow: number = Date.now();

  console.log(newGame.dates);

  const addedGame: Game = {
    id: newGame.id,
    title: newGame.title,
    type: newGame.type,
    dmName: newGame.dmName,
    notes: newGame.notes,
    dates: newGame.dates,
  };
  await addDoc(collection(fireStoreDb, collectionPath), addedGame);
};

export const deleteFromGames = async (id: string) => {
  await deleteDoc(doc(fireStoreDb, collectionPath, id));
};

export const getFromGames = async () => {
  return await getDocs(collection(fireStoreDb, collectionPath));
};
