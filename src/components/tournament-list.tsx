import { Component, onMount, For } from "solid-js";
import { useStore } from "../store";
import { css } from "@emotion/css";
import Tournament from "./tournament-item";

const TournamentList: Component = () => {
  const { state, actions } = useStore();

  onMount(() => {
    actions.getAdminTournaments();
    actions.getParticipantTournaments();
  });

  const ulStyles = css`
    list-style: none;
    margin: 0;
    padding: 0;
    margin-left: 12px;
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  `;

  return (
    <ul class={ulStyles}>
      <For
        each={state.tournaments.all}
        fallback={<div>Use the form to create your first tournament.</div>}
      >
        {(tournament) => <Tournament {...tournament} />}
      </For>
    </ul>
  );
};

export default TournamentList;
