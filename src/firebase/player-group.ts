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

export const updatePlayerGroup = async (gameId: string, player: Player) => {
  const querySnapshot = await getDocs(collection(fireStoreDb, collectionPath));
  let existingId = "";
  let players: Player[] = [];

  // const dateNow: number = Date.now();
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
    console.log("NEW P");
  } else {
    players.map((pl) => {
      if (pl.id === player.id) pl.name = player.name;
    });
    console.log("EDIT P");
  }

  console.log("PLAYER", player);
  console.log("PLAYERS", players);

  const gameRef = doc(fireStoreDb, collectionPath, existingId);
  await updateDoc(gameRef, { players: players });
};

export const deletePlayerGroup = async (id: string) => {
  await deleteDoc(doc(fireStoreDb, collectionPath, id));
};

export const getPlayerGroup = async () => {
  return await getDocs(collection(fireStoreDb, collectionPath));
};
