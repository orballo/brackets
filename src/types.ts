export interface State {
  isConnected: boolean;
  isSynced: boolean;
  user: string;
  ethereum: any;
  provider: any;
  contractAddress: string;
  createTournament: {
    numberOfPlayers: number;
    registerMethod: string;
    isSubmitting: boolean;
  };
  tournaments: {
    all: Tournament[];
    admin: TournamentPayload[];
    participant: TournamentPayload[];
    currentId: string;
    currentTournament?: Tournament;
  };
}

export interface TournamentPayload {
  id: number;
  numberOfPlayers: number;
  registerMethod: string;
  status: string;
}

export interface Tournament extends TournamentPayload {
  admin?: boolean;
  participant?: boolean;
}
