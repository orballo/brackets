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
    align-items: center;
    height: 100%;
    flex-direction: row;
  `;

  return (
    <main class={mainStyles}>
      <Show when={state.isConnected}>
        <CreateTournament />
        <TournamentList />
      </Show>
      <Show when={!state.isConnected && state.isSynced}>
        <ButtonConnect />
      </Show>
    </main>
  );
};

export default Main;
