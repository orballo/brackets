import { Component, onMount } from "solid-js";
import { useStore } from "../store";
import Header from "./header";
import ButtonConnect from "./button-connect";

const App: Component = () => {
  const { actions } = useStore();

  onMount(() => {
    actions.detectProvider();
  });

  return (
    <>
      <Header />
      <main>
        <ButtonConnect />
      </main>
    </>
  );
};

export default App;
