import type { Component } from "solid-js";
import { useStore } from "../store";

const App: Component = () => {
  const { state, actions } = useStore();

  return (
    <>
      <header></header>
      <main>
        <h1>Brackets</h1>
        <div>Counter:{state.count}</div>
        <button onClick={() => actions.increment()}>+</button>
      </main>
    </>
  );
};

export default App;
