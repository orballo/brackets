import { readable, get } from "svelte/store";
import { ethers } from "ethers";
import { encrypt } from "../utils";
import connection from "./connection";
import Brackets from "../../artifacts/contracts/Brackets.sol/Brackets.json";

const createContract = () => {
  const address = readable("0x5FbDB2315678afecb367f032d93F642f64180aa3");

  async function getTournaments() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(get(address), Brackets.abi, provider);

    console.log("contract:", contract);

    const response = await contract.getTournaments(get(connection).address);

    const tournaments = response.map(mapTournament);

    console.log("response:", tournaments);
  }

  function mapTournament(data: any) {
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
      isAdmin:
        data.admin.toUpperCase() === get(connection).address.toUpperCase(),
      isParticipant: !!data.participants.find(
        (p: string) => p.toUpperCase() === get(connection).address.toUpperCase()
      ),
    };
  }

  return { subscribe: address.subscribe, getTournaments };
};

export default createContract();
