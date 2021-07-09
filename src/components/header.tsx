import { Show, Component } from "solid-js";
import { css } from "@emotion/css";
import { useStore } from "../store";
import UserIcon from "./user-icon";

const Header: Component = () => {
  const { state } = useStore();

  const headerStyles = css`
    position: absolute;
    height: 52px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
  `;

  const titleStyles = css`
    margin: 0;
    color: #fff;
  `;

  return (
    <header class={headerStyles}>
      <a href="/">
        <h1 class={titleStyles}>Brackets</h1>
      </a>
      <Show when={state.isConnected}>
        <UserIcon userAddress={state.user} />
      </Show>
    </header>
  );
};

export default Header;
