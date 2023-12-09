import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { fireStoreDb } from "./config";
import { v4 } from "uuid";

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

export const copyPlayerGroup = async (copiedPlayerGroup: PlayerGroup) => {
  await addDoc(collection(fireStoreDb, collectionPath), copiedPlayerGroup);
};

export const updatePlayerGroup = async (gameId: string, player: Player) => {
  const querySnapshot = await getDocs(collection(fireStoreDb, collectionPath));
  let existingId = "";
  let players: Player[] = [];

  querySnapshot.forEach((doc) => {
    if (doc.data().gameId === gameId) {
      existingId = doc.id;
      players = doc.data().players;
      return;
    }
  });

  let foundPlayer = players.find((pl) => pl.id === player.id);
  if (!foundPlayer) {
    player.id = v4();
    players.push(player);
  } else {
    players.map((pl) => {
      if (pl.id === player.id) {
        pl.name = player.name;
        pl.canPlay = player.canPlay;
      }
    });
  }

  const gameRef = doc(fireStoreDb, collectionPath, existingId);
  await updateDoc(gameRef, { players: players });
};

export const deletePlayerGroup = async (gameId: string) => {
  const querySnapshot = await getDocs(collection(fireStoreDb, collectionPath));
  let existingId = "";

  querySnapshot.forEach((doc) => {
    if (doc.data().gameId === gameId) {
      existingId = doc.id;
      return;
    }
  });

  await deleteDoc(doc(fireStoreDb, collectionPath, existingId));
};

export const deletePlayerFromGroup = async (gameId: string, playerId: string) => {
  const querySnapshot = await getDocs(collection(fireStoreDb, collectionPath));
  let existingId = "";
  let players: Player[] = [];

  querySnapshot.forEach((doc) => {
    if (doc.data().gameId === gameId) {
      existingId = doc.id;
      players = doc.data().players;
      return;
    }
  });

  const updatedPlayers: Player[] = players.filter((pl) => pl.id !== playerId);

  const gameRef = doc(fireStoreDb, collectionPath, existingId);
  await updateDoc(gameRef, { players: updatedPlayers });
};

export const getPlayerGroups = async () => {
  return await getDocs(collection(fireStoreDb, collectionPath));
};
