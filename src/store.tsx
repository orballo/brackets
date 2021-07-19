import { createStore } from "solid-js/store";
import { createContext, onMount, useContext } from "solid-js";
import { ethers } from "ethers";
import detectProvider from "@metamask/detect-provider";
import { State, Tournament } from "./types";
import { encrypt, decrypt } from "./utils";

import Brackets from "../artifacts/contracts/Brackets.sol/Brackets.json";

const initialState: State = {
  get isConnected() {
    return !!this.user;
  },
  isSynced: false,
  user: "",
  ethereum: null,
  provider: null,
  contractAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  createTournament: {
    numberOfPlayers: 2,
    prizePayer: "admin",
    prizeQuantity: 0,
    updatesMethod: "admin",
    conflictResolution: "admin",
    isSubmitting: false,
  },
  tournaments: {
    list: [],
    get currentId() {
      const matches = window.location.pathname.match(/\/t\/([\w\d]*)\/?/);
      const id = matches ? decrypt(matches[1]) : null;
      return id;
    },
  },
  route: "list",
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
        await actions.getTournaments();
        if (state.tournaments.currentId) await actions.getTournament();
      }

      ethereum.on("accountsChanged", async ([address]: string[]) => {
        setState("user", address || "");

        if (address) {
          const provider = new ethers.providers.Web3Provider(state.ethereum);
          setState("provider", provider);
          await actions.getTournaments();
          if (state.tournaments.currentId) await actions.getTournament();
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
    }
  },
  getTournament: async () => {
    const contract = new ethers.Contract(
      state.contractAddress,
      Brackets.abi,
      state.provider
    );

    const response = await contract.getTournament(state.tournaments.currentId);

    const tournament = actions.mapTournament(response);

    setState("tournaments", "currentTournament", tournament);
  },
  getTournaments: async () => {
    const contract = new ethers.Contract(
      state.contractAddress,
      Brackets.abi,
      state.provider
    );

    const response = await contract.getTournaments(
      state.ethereum.selectedAddress
    );

    const tournaments = response.map(actions.mapTournament);

    setState("tournaments", "list", tournaments);
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

      await actions.getTournaments();
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

      await actions.getTournaments();
    } catch (error) {
      console.error(error);
    }
  },
  unregisterParticipant: async (id: number) => {
    const signer = state.provider.getSigner();
    const contract = new ethers.Contract(
      state.contractAddress,
      Brackets.abi,
      signer
    );

    try {
      const transaction = await contract.unregisterParticipant(id);
      await state.provider.waitForTransaction(transaction.hash);

      await actions.getTournaments();
    } catch (error) {
      console.error(error);
    }
  },
  updateCreateTournamentField: (name: any, value: any) => {
    if (name === "numberOfPlayers") value = parseInt(value);

    setState("createTournament", name, value);
  },
  mapTournament: (data: any) => {
    return {
      id: data.id,
      code: encrypt(data.id.toString()),
      numberOfPlayers: data.numberOfPlayers,
      status: data.status,
      admin: data.admin,
      participants: data.participants.filter(
        (participant: string) =>
          participant !== "0x0000000000000000000000000000000000000000"
      ),
      isAdmin: data.admin.toUpperCase() === state.user.toUpperCase(),
      isParticipant: !!data.participants.find(
        (p: string) => p.toUpperCase() === state.user.toUpperCase()
      ),
    };
  },
  updateRoute: (value: State["route"]) => {
    setState("route", value);
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
