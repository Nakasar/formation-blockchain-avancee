import React from 'react';

const Web3Context = React.createContext({ loaded: false });

function Web3ContextProvider(props) {
    const [loaded, setLoaded] = React.useState(false);
    const [provider, setProvider] = React.useState(null);
    const [chainId, setChainId] = React.useState(null);
    const [walletAddress, setWalletAddress] = React.useState('');

    async function loadWallet() {
        if (loaded) {
            throw new Error('WALLET_ALREADY_LOADED');
        }

        if (typeof window.ethereum === 'undefined') {
            throw new Error('ETHEREUM_NOT_INSTALLED');
        }

        // @TODO : Initialiser la connexion avec le wallet. Ne pas oublier les évènements de changement de réseau ou de compte !

        /**
        setProvider(web3Provider);
        setWalletAddress(await web3provider.getSigner().getAddress());
        setChainId((await web3provider.getNetwork()).chainId);
        setLoaded(true);
         */
    }

    async function unloadWallet() {
        if (!loaded) {
            throw new Error('WALLET_NOT_LOADED');
        }

        setLoaded(false);
        setWalletAddress('');

        window.ethereum.removeAllListeners('accountsChanged'); // On retire bien tous les évènements pour éviter les fuites mémoire.
    }

    let value = {
        loaded,
        loadWallet,
        provider,
        unloadWallet,
        walletAddress,
        chainId,
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

export const useWeb3 = () => React.useContext(Web3Context);
