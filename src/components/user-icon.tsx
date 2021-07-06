import type { Component } from "solid-js";
import { createEffect } from "solid-js";
import jazzicon from "jazzicon";
import { css } from "@emotion/css";
import { useStore } from "../store";

const UserIcon: Component<{ userAddress: string }> = ({ userAddress = "" }) => {
  let ref: any;

  const { state } = useStore();

  createEffect(() => {
    const icon = jazzicon(32, parseInt(state.user.slice(2, 10), 16));
    if (ref && state.isConnected) {
      ref.innerHTML = "";
      ref.appendChild(icon);
    }
  });

  const containerStyles = css`
    margin-left: auto;
  `;

  return <div title={userAddress} class={containerStyles} ref={ref} />;
};

export default UserIcon;
