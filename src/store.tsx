import { createStore } from "solid-js/store";
import { createContext, onMount, useContext } from "solid-js";
import { ethers } from "ethers";
import detectProvider from "@metamask/detect-provider";

import Brackets from "../artifacts/contracts/Brackets.sol/Brackets.json";

interface State {
  isConnected: boolean;
  user: string;
  ethereum: any;
  provider: any;
  contractAddress: string;
  createTournament: {
    name: string;
    isSubmitting: boolean;
  };
  tournamentList: { id: number }[];
}

const initialState: State = {
  isConnected: false,
  user: "",
  ethereum: null,
  provider: null,
  contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  createTournament: {
    name: "",
    isSubmitting: false,
  },
  tournamentList: [],
};

const [state, setState] = createStore(initialState);

const actions = {
  detectProvider: async () => {
    const ethereum: any = await detectProvider();

    if (ethereum) {
      // Store the ethereum object in the state.
      setState("ethereum", ethereum);

      // Request wallet accounts connected to this site.
      const [address] = await ethereum.request({ method: "eth_accounts" });

      if (address) {
        // Connect to blockchain.
        setState("user", ethereum.selectedAddress);
        const provider = new ethers.providers.Web3Provider(state.ethereum);
        setState("provider", provider);
        setState("isConnected", true);
      }

      ethereum.on("accountsChanged", ([address]: string[]) => {
        setState("user", address || "");

        if (address) {
          const provider = new ethers.providers.Web3Provider(state.ethereum);
          setState("provider", provider);
        } else {
          setState("isConnected", false);
        }
      });
    }
  },
  connect: async () => {
    const [address] = await state.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (address) {
      setState("user", address);
      const provider = new ethers.providers.Web3Provider(state.ethereum);
      setState("provider", provider);
      setState("isConnected", true);
    }
  },
  getTournaments: async () => {
    const contract = new ethers.Contract(
      state.contractAddress,
      Brackets.abi,
      state.provider
    );
    const response = await contract.getTournamentsByAdmin();

    const tournaments = response.map((item: any) => ({
      id: item.id,
    }));

    setState("tournamentList", tournaments);
  },
  createTournament: async () => {
    setState("createTournament", "isSubmitting", true);

    const signer = state.provider.getSigner();
    const contract = new ethers.Contract(
      state.contractAddress,
      Brackets.abi,
      signer
    );
    try {
      const transaction = await contract.createTournament();
      await state.provider.waitForTransaction(transaction.hash);

      actions.getTournaments();
    } catch (error) {
      console.error(error);
    }

    setState("createTournament", "isSubmitting", false);
  },
};

const store = { state, actions };
const Context = createContext(store);

const Store = ({ children }) => {
  onMount(() => {
    (window as any).store = store;
  });
  return <Context.Provider value={store}>{children}</Context.Provider>;
};

export default Store;

export const useStore = () => useContext(Context);
