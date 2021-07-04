import { createStore } from "solid-js/store";
import { createContext, useContext } from "solid-js";

const [state, setState] = createStore({ count: 0 });
const actions = {
  increment: () => setState("count", (c) => c + 1),
};
const store = { state, actions };
const Context = createContext(store);

const Store = ({ children }) => {
  return <Context.Provider value={store}>{children}</Context.Provider>;
};

export default Store;

export const useStore = () => {
  return useContext(Context);
};
