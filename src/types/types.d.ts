type UserName = {
  id: string;
  displayName: string;
};

type PlayTime = {
  hours: number;
  minutes: number;
};

type PlayIf = {
  fromTime: "None" | PlayTime;
  toTime: "None" | PlayTime;
};

type CanPlay = "Yes" | "No" | PlayIf;

type Player = {
  id: string;
  name: string;
  isDm: boolean;
  canPlay: CanPlay[];
};

type PlayerGroup = {
  gameId: string;
  players: Player[];
};

type Game = {
  id: string;
  title: string;
  type: string;
  notes: string;
  dates: string[];
  startAt: PlayTime;
  timestamp: number;
};
