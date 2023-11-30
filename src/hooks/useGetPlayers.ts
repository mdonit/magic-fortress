import { useState, useEffect } from "react";
import { getFromNames } from "@firebase/player-group";

export const useGetPlayers = () => {
  const [players, setPlayers] = useState<UserName[]>([]);

  useEffect(() => {
    const helper = async () => {
      const initPlayers = await getFromNames();

      const playersReceived: UserName[] = [];

      initPlayers.forEach((doc) => {
        playersReceived.push({ id: doc.id, displayName: doc.data().displayName });
      });

      setPlayers(playersReceived);
    };
    helper();
  }, []);

  return players;
};
