import { Component, Show } from "solid-js";
import { useStore } from "../store";

const ButtonConnect: Component = () => {
  const { state, actions } = useStore();

  return (
    <Show when={!state.isConnected}>
      <button onClick={actions.connect}>Connect with Metamask</button>
    </Show>
  );
};

export default ButtonConnect;
