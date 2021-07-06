import { Component, onMount } from "solid-js";
import { useStore } from "../store";

const TournamentList: Component = () => {
  const { state, actions } = useStore();

  onMount(() => {
    actions.getTournaments();
  });

  return (
    <div>
      <ul>
        {state.tournamentList.map((tournament) => (
          <li>{tournament.id}</li>
        ))}
      </ul>
    </div>
  );
};

export default TournamentList;
