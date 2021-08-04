import { writable } from "svelte/store";

export interface Tournament {
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

export default writable(null as Tournament);
