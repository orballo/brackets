import { Show, Component, onMount } from "solid-js";
import { css, injectGlobal } from "@emotion/css";
import { useStore } from "../store";
import Header from "./header";
import ButtonConnect from "./button-connect";

injectGlobal`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #0a1931;
    color: #fff;
  }

  html, body, #root {
    height: 100%;
  }

  * {
    box-sizing: border-box;
  }
`;

const App: Component = () => {
  const { state, actions } = useStore();

  onMount(() => {
    actions.detectProvider();
  });

  const mainStyles = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  `;

  return (
    <>
      <Header />
      <main class={mainStyles}>
        <Show when={!state.isConnected}>
          <ButtonConnect />
        </Show>
      </main>
    </>
  );
};

export default App;
