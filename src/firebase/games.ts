import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { fireStoreDb } from "./config";

const collectionPath = "games";

export const addToGames = async (newGame: Game) => {
  // const dateNow: number = Date.now();
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

// export const updateGames = async (gameId: string, playerId: string, playerCalendar: PlayerCalendar) => {
//   const querySnapshot = await getDocs(collection(fireStoreDb, collectionPath));
//   let existingId = "";
//   let playerCalendars: PlayerCalendar[] = [];
//   // const dateNow: number = Date.now();
//   querySnapshot.forEach((doc) => {
//     if (doc.id === gameId) {
//       existingId = doc.id;
//       playerCalendars = doc.data().playerCalendars;
//       return;
//     }
//   });

//   playerCalendars.push({
//     id: playerId,
//     dayMon: playerCalendar.dayMon,
//     dayTue: playerCalendar.dayTue,
//     dayWed: playerCalendar.dayWed,
//     dayThu: playerCalendar.dayThu,
//     dayFri: playerCalendar.dayFri,
//     daySat: playerCalendar.daySat,
//     daySun: playerCalendar.daySun,
//   });
//   const gameRef = doc(fireStoreDb, collectionPath, existingId);
//   await updateDoc(gameRef, { playerCalendars: playerCalendars });
// };

export const deleteFromGames = async (id: string) => {
  await deleteDoc(doc(fireStoreDb, collectionPath, id));
};

export const getFromGames = async () => {
  return await getDocs(collection(fireStoreDb, collectionPath));
};
