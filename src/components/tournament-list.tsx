import { Component, onMount, For } from "solid-js";
import { useStore } from "../store";
import { css } from "@emotion/css";
import Tournament from "./tournament-item";

const TournamentList: Component = () => {
  const { state, actions } = useStore();

  onMount(() => {
    actions.getTournaments();
  });

  const ulStyles = css`
    list-style: none;
    margin: 0;
    padding: 12px;
    width: 50%;
    display: flex;
    justify-content: center;
  `;

  return (
    <ul class={ulStyles}>
      <For
        each={state.tournamentList}
        fallback={<div>Use the form to create your first tournament.</div>}
      >
        {(tournament) => <Tournament {...tournament} />}
      </For>
    </ul>
  );
};

export default TournamentList;
