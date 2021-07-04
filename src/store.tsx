import { createStore } from "solid-js/store";
import { createContext, useContext } from "solid-js";
import detectProvider from "@metamask/detect-provider";

const initialState = {
  isConnected: false,
  user: "",
  metamask: null,
  provider: null,
};

const [state, setState] = createStore(initialState);

const actions = {
  detectProvider: async () => {
    const ethereum: any = await detectProvider({ mustBeMetaMask: true });

    if (ethereum) {
      setState("metamask", ethereum);

      const [address] = await ethereum.request({ method: "eth_accounts" });

      if (address) {
        setState("user", ethereum.selectedAddress);
        setState("isConnected", true);
      }

      ethereum.on("accountsChanged", ([address]: string[]) => {
        setState("user", address || "");
        setState("isConnected", false);
      });
    }
  },
  connect: async () => {
    const [address] = await state.metamask.request({
      method: "eth_requestAccounts",
    });

    if (address) {
      setState("user", address);
      setState("isConnected", true);
    }
  },
};

const store = { state, actions };
const Context = createContext(store);

const Store = ({ children }) => {
  return <Context.Provider value={store}>{children}</Context.Provider>;
};

export default Store;

export const useStore = () => useContext(Context);
