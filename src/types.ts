export interface State {
  isConnected: boolean;
  user: string;
  ethereum: any;
  provider: any;
  contractAddress: string;
  createTournament: {
    name: string;
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