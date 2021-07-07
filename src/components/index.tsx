import { Component, onMount } from "solid-js";
import { injectGlobal } from "@emotion/css";
import { useStore } from "../store";
import Header from "./header";
import Main from "./main";

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

  return (
    <>
      <Header />
      <Main />
    </>
  );
};

export default App;
