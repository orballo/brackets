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
  tournamentList: Tournament[];
}

export interface Tournament {
  id: number;
  numberOfPlayers: number;
  registerMethod: string;
  status: string;
}
