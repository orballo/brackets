import { createStore } from "solid-js/store";
import { createContext, onMount, useContext } from "solid-js";
import { ethers } from "ethers";
import detectProvider from "@metamask/detect-provider";
import { State, TournamentPayload } from "./types";

import Brackets from "../artifacts/contracts/Brackets.sol/Brackets.json";

const initialState: State = {
  isConnected: false,
  isSynced: false,
  user: "",
  ethereum: null,
  provider: null,
  contractAddress: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  createTournament: {
    numberOfPlayers: 2,
    registerMethod: "direct",
    isSubmitting: false,
  },
  tournaments: {
    get all() {
      const { admin, participant } = this as State["tournaments"];

      const all = admin.concat(participant).reduce((final, current) => {
        const index = final.findIndex((t) => t.id === current.id);

        if (index >= 0) {
          Object.assign(final[index], current);
        } else {
          final.push({ ...current });
        }

        return final;
      }, []);

      return all;
    },
    admin: [],
    participant: [],
  },
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

      setState("isSynced", true);
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
  getAdminTournaments: async () => {
    const contract = new ethers.Contract(
      state.contractAddress,
      Brackets.abi,
      state.provider
    );

    const response = await contract.getTournamentsByAdmin();

    const tournaments = response.map((item: TournamentPayload) => ({
      id: item.id,
      numberOfPlayers: item.numberOfPlayers,
      registerMethod: item.registerMethod,
      status: item.status,
      admin: true,
    }));

    setState("tournaments", "admin", tournaments);
  },
  getParticipantTournaments: async () => {
    const contract = new ethers.Contract(
      state.contractAddress,
      Brackets.abi,
      state.provider
    );

    const response = await contract.getTournamentsByParticipant();

    const tournaments = response.map((item: TournamentPayload) => ({
      id: item.id,
      numberOfPlayers: item.numberOfPlayers,
      registerMethod: item.registerMethod,
      status: item.status,
      participant: true,
    }));

    setState("tournaments", "participant", tournaments);
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
      const transaction = await contract.createTournament({
        numberOfPlayers: state.createTournament.numberOfPlayers,
        registerMethod: state.createTournament.registerMethod,
      });
      await state.provider.waitForTransaction(transaction.hash);

      actions.getAdminTournaments();
      actions.getParticipantTournaments();
    } catch (error) {
      console.error(error);
    }

    setState("createTournament", "isSubmitting", false);
  },
  registerParticipant: async (id: number) => {
    const signer = state.provider.getSigner();
    const contract = new ethers.Contract(
      state.contractAddress,
      Brackets.abi,
      signer
    );

    try {
      const transaction = await contract.registerParticipant(id);
      await state.provider.waitForTransaction(transaction.hash);

      actions.getAdminTournaments();
      actions.getParticipantTournaments();
    } catch (error) {
      console.error(error);
    }
  },
  updateCreateTournamentField: (name: any, value: any) => {
    if (name === "numberOfPlayers") value = parseInt(value);

    setState("createTournament", name, value);
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
