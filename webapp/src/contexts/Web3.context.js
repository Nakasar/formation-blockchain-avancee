import {createContext, useContext, useState} from "react";

const Web3Context = createContext({ loaded: false });

function Web3ContextProvider(props) {
  const [loaded, setLoaded] = useState(false);
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  async function loadWallet() {
    if (loaded) {
      // Avant d'appeler `loadWallet()`, il faut vérifier s'il n'est pas déjà chargé avec la propriété `loaded`
      throw new Error('WALLET_ALREADY_LOADED');
    }

    if (typeof window.ethereum === 'undefined') {
      // Metamask n'est pas installé.
      throw new Error('ETHEREUM_NOT_INSTALLED');
    }

    // @TODO Connexion au Wallet et au provider.

    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Subscribe to accounts change
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setLoaded(true);
      } else {
        setLoaded(false);
        setWalletAddress('');
      }
    });

    setWalletAddress(window.ethereum.selectedAddress);
    setLoaded(true);
  }

  async function unloadWallet() {
    if (!loaded) {
      throw new Error('WALLET_NOT_LOADED');
    }

    setLoaded(false);
    setWalletAddress('');

    window.ethereum.removeAllListeners('accountsChanged');
  }

  let value = {
    loaded,
    loadWallet,
    provider,
    unloadWallet,
    walletAddress,
  };

  return (
    <Web3Context.Provider value={value}>{props.children}</Web3Context.Provider>
  );
}

const Web3ContextConsumer = Web3Context.Consumer;

export const withWeb3 = Component => props => (
  <Web3ContextConsumer>
    {value => <Component {...props} web3Context={value} />}
  </Web3ContextConsumer>
);

export default Web3Context;

export { Web3ContextConsumer, Web3ContextProvider };

export const useWeb3 = () => useContext(Web3Context);
