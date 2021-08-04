import { writable } from "svelte/store";

interface Tournament {
  id: number;
  code: string;
  numberOfPlayers: number;
  initialPrize: number;
  registrationFee: number;
  status: string;
  admin: string;
  participants: string[];
  isAdmin: boolean;
  isParticipant: boolean;
}

export default writable([] as Tournament[]);
