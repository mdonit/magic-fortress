type UserName = {
  id: string;
  displayName: string;
};

type PlayTime = {
  hours: number;
  minutes: number;
};

type CanPlay = "Yes" | "No" | PlayTime;

type Player = {
  id: string;
  name: string;
  isDm: boolean;
  // timeSet: boolean[];
  canPlay: CanPlay[];
};

type PlayerGroup = {
  gameId: string;
  groupName: string;
  players: Player[];
};

type Game = {
  id: string;
  title: string;
  type: string;
  dmName: string;
  notes: string;
  dates: string[];
  startAt: PlayTime;
};
