import { Component } from "solid-js";
import { css } from "@emotion/css";
import { useStore } from "../store";

const Nav: Component = () => {
  const { actions } = useStore();

  const navStyles = css`
    height: 52px;
    width: 100%;
    border-bottom: 4px solid #0a1931;
    position: absolute;
    top: 52px;
  `;

  const buttonStyles = css`
    height: 100%;
    width: 52px;
  `;

  return (
    <nav class={navStyles}>
      <button class={buttonStyles} onClick={() => actions.updateRoute("list")}>
        List
      </button>
      <button
        class={buttonStyles}
        onClick={() => actions.updateRoute("create")}
      >
        Create
      </button>
    </nav>
  );
};

export default Nav;
