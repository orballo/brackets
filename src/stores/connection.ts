import { writable } from "svelte/store";
import { push } from "svelte-spa-router";
import metamaskDetectProvider from "@metamask/detect-provider";

const createConnection = () => {
  const { subscribe, update } = writable({
    hasWallet: false,
    isSynced: false,
    isConnected: false,
    address: null,
  });

  // Initialize the store.
  async function initialize(value: Record<string, any>) {
    return update((self) => {
      Object.assign(self, value);
      console.log("Initialize:", self);
      return self;
    });
  }

  // Detect if there is a provider installed.
  async function detectProvider() {
    const ethereum: any = await metamaskDetectProvider();
    if (ethereum) detectAddress();
    else initialize({ hasWallet: false, isSynced: true, isConnected: false });
  }

  // Detect if there is an address connected.
  async function detectAddress() {
    (window as any).ethereum
      .request({
        method: "eth_accounts",
      })
      .then(([address]) => {
        const hasWallet = true;
        const isSynced = true;
        let isConnected: boolean;
        let storeAddress: string;

        console.log("on detect address:", address);

        if (address) {
          storeAddress = address;
          isConnected = true;
        } else {
          isConnected = false;
        }

        initialize({ hasWallet, isSynced, isConnected, address: storeAddress });
      })
      .catch(console.error);

    (window as any).ethereum.on("accountsChanged", ([address]) => {
      let isConnected: boolean;
      let storeAddress: string;

      if (address) {
        isConnected = true;
        storeAddress = address;
      } else {
        isConnected = false;
      }

      initialize({ isConnected, address: storeAddress });
    });
  }

  async function connect() {
    (window as any).ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then(([address]) => {
        const hasWallet = true;
        const isSynced = true;
        let isConnected: boolean;
        let storeAddress: string;

        console.log("on connect address:", address);

        if (address) {
          storeAddress = address;
          isConnected = true;
        } else {
          isConnected = false;
        }

        initialize({ hasWallet, isSynced, isConnected, address: storeAddress });

        if (isConnected) {
          push("/dashboard");
        }
      })
      .catch(console.error);
  }

  return { subscribe, initialize, detectProvider, detectAddress, connect };
};

export default createConnection();
