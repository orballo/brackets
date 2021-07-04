import type { Component } from "solid-js";
import { createEffect, Show } from "solid-js";
import jazzicon from "jazzicon";
import { css } from "@emotion/css";
import { useStore } from "../store";

const UserIcon: Component<{ userAddress: string }> = ({ userAddress = "" }) => {
  let ref: any;

  const { state } = useStore();

  createEffect(() => {
    console.log('ref:', ref)
    if (ref && state.isConnected) {
      const icon = jazzicon(32, parseInt(state.user.slice(2, 10), 16));
      ref.appendChild(icon);
    }
  });

  const containerStyles = css`
    margin-left: auto;
  `;

  return (
    <Show when={state.isConnected}>
      <div title={userAddress} class={containerStyles} ref={ref} />
    </Show>
  );
};

export default UserIcon;
