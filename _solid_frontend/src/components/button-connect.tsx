import { Component, Show } from "solid-js";
import { css } from "@emotion/css";
import { useStore } from "../store";

const ButtonConnect: Component = () => {
  const { actions } = useStore();

  const buttonStyles = css`
    height: 52px;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    padding: 0 12px;
  `;

  return (
    <button class={buttonStyles} onClick={actions.connect}>
      Connect with Metamask
    </button>
  );
};

export default ButtonConnect;
