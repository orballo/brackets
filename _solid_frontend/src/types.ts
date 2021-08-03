export interface State {
  isConnected: boolean;
  isSynced: boolean;
  user: string;
  ethereum: any;
  provider: any;
  contractAddress: string;
  createTournament: {
    numberOfPlayers: number;
    prizePayer: "admin" | "participants";
    prizeQuantity: number;
    reports: "admin" | "participants";
    conflicts: "admin" | "participants";
    isSubmitting: boolean;
  };
  tournaments: {
    list: Tournament[];
    currentId: string;
    currentTournament?: Tournament;
  };
  route: "create" | "list" | "invitation";
}

export interface Tournament {
  id: number;
  code: string;
  numberOfPlayers: number;
  status: string;
  admin: string;
  participants: string[];
  isAdmin: boolean;
  isParticipant: boolean;
}
