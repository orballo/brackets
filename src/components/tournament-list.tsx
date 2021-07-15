import { Component, For } from "solid-js";
import { useStore } from "../store";
import { css } from "@emotion/css";
import Tournament from "./tournament-item";

const TournamentList: Component = () => {
  const { state } = useStore();

  const ulStyles = css`
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: auto;
  `;

  return (
    <ul class={ulStyles}>
      <For
        each={
          !state.tournaments.currentId
            ? state.tournaments.list
            : state.tournaments.currentTournament
            ? [state.tournaments.currentTournament]
            : []
        }
        fallback={
          <div>
            {!state.tournaments.currentId
              ? "Use the form to create your first tournament."
              : "Loading the tournament..."}
          </div>
        }
      >
        {(tournament) => <Tournament {...tournament} />}
      </For>
    </ul>
  );
};

export default TournamentList;
