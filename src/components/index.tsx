import { Component, onMount } from "solid-js";
import { useStore } from "../store";
import Header from "./header";
import Main from "./main";

const App: Component = () => {
  const { actions } = useStore();

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
