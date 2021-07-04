import { Component } from "solid-js";
import { css } from "@emotion/css";
import { useStore } from "../store";
import UserIcon from "./user-icon";

const Header: Component = () => {
  const { state } = useStore();

  const headerStyles = css`
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
      <h1 class={titleStyles}>Brackets</h1>
      <UserIcon userAddress={state.user} />
    </header>
  );
};

export default Header;
