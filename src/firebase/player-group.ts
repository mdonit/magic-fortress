import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { fireStoreDb } from "./config";

const collectionPath = "playergroup";

export const addPlayerGroup = async (gameId: string, player: Player) => {
  const group: Player[] = [];
  group.push(player);

  const newPlayerGroup: PlayerGroup = {
    gameId,
    players: group,
  };

  await addDoc(collection(fireStoreDb, collectionPath), newPlayerGroup);
};

export const deletePlayerGroup = async (id: string) => {
  await deleteDoc(doc(fireStoreDb, collectionPath, id));
};

export const getPlayerGroup = async () => {
  return await getDocs(collection(fireStoreDb, collectionPath));
};
