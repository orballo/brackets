import { readable, get } from "svelte/store";
import { ethers } from "ethers";
import { push } from "svelte-spa-router";
import { encrypt, decrypt } from "../utils";
import connection from "./connection";
import tournament from "./tournament";
import tournaments from "./tournaments";
import newTournament from "./new-tournament";
import Brackets from "../../artifacts/contracts/Brackets.sol/Brackets.json";

const createContract = () => {
  const address = readable("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

  async function getTournaments() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(get(address), Brackets.abi, provider);
    const response = await contract.getTournaments(get(connection).address);
    const list = response.map(mapTournament);
    tournaments.set(list);
    console.log("In getTournaments:", get(tournaments));
  }

  async function getTournament(id: number) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(get(address), Brackets.abi, provider);
    const response = await contract.getTournament(id);
    const data = mapTournament(response);
    tournament.set(data);
    console.log("In getTournament:", get(tournament));
  }

  async function createTournament() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(get(address), Brackets.abi, signer);

    try {
      const payload = get(newTournament);
      const transaction = await contract.createTournament(payload);
      await provider.waitForTransaction(transaction.hash);
      push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  async function registerParticipant(id: number) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(get(address), Brackets.abi, signer);

    try {
      const transaction = await contract.registerParticipant(id);
      await provider.waitForTransaction(transaction.hash);
      await getTournaments();
      await getTournament(id);
    } catch (error) {
      console.error(error);
    }
  }

  async function unregisterParticipant(id: number) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(get(address), Brackets.abi, signer);

    try {
      const transaction = await contract.unregisterParticipant(id);
      await provider.waitForTransaction(transaction.hash);
      await getTournaments();
      await getTournament(id);
    } catch (error) {
      console.error(error);
    }
  }

  function mapTournament(data: any) {
    return {
      id: data.id,
      code: encrypt(data.id.toString()),
      numberOfPlayers: data.numberOfPlayers,
      initialPrize: data.initialPrize,
      registrationFee: data.registrationFee,
      status: data.status,
      admin: data.admin,
      participants: data.participants.filter(
        (participant: string) =>
          participant !== "0x0000000000000000000000000000000000000000"
      ),
      isAdmin:
        data.admin.toUpperCase() === get(connection).address.toUpperCase(),
      isParticipant: !!data.participants.find(
        (p: string) => p.toUpperCase() === get(connection).address.toUpperCase()
      ),
    };
  }

  return {
    subscribe: address.subscribe,
    getTournaments,
    getTournament,
    createTournament,
    registerParticipant,
    unregisterParticipant,
  };
};

export default createContract();
