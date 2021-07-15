import { Component, onMount } from "solid-js";
import { useStore } from "../store";
import Menu from "./menu";
import Main from "./main";

const App: Component = () => {
  const { actions } = useStore();

  onMount(() => {
    actions.detectProvider();
  });

  return (
    <>
      <Menu />
      <Main />
    </>
  );
};

export default App;
