type UserName = {
  id: string;
  displayName: string;
};

type CanPlay = "Yes" | "No" | "Maybe";

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
  dmName: string;
  notes: string;
  dates: string[];
};
