import { Component, Show } from "solid-js";
import { css } from "@emotion/css";
import { useStore } from "../store";
import ButtonConnect from "./button-connect";
import CreateTournament from "./create-tournament";
import TournamentList from "./tournament-list";

const Main: Component = () => {
  const { state } = useStore();

  const mainStyles = css`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 100%;
    flex-direction: row;
    padding-top: 120px;
  `;

  return (
    <main class={mainStyles}>
      <Show when={state.isConnected && !state.tournaments.currentId}>
        <CreateTournament />
      </Show>
      <Show when={state.isConnected}>
        <TournamentList />
      </Show>
      <Show when={!state.isConnected && state.isSynced}>
        <ButtonConnect />
      </Show>
    </main>
  );
};

export default Main;
