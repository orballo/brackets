import { Component, Show } from "solid-js";
import { css } from "@emotion/css";
import Header from "./header";
import Nav from "./nav";
import CreateTournament from "./create-tournament";
import ListTournaments from "./tournament-list";
import { useStore } from "../store";

const Menu: Component = () => {
  const { state } = useStore();

  const asideStyles = css`
    position: relative;
    width: 375px;
    background-color: #fff;
    flex-shrink: 0;
    padding-top: 104px;
  `;

  return (
    <aside class={asideStyles}>
      <Header />
      <Nav />
      <Show when={state.route === "list"}>
        <ListTournaments />
      </Show>
      <Show when={state.route === "create"}>
        <CreateTournament />
      </Show>
    </aside>
  );
};

export default Menu;
