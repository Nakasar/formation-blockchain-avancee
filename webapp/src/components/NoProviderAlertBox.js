import {useWeb3} from "../contexts/Web3.context";

export default function NoProviderAlertBox() {
  const web3 = useWeb3();

  return (
    <section style={{ backgroundColor: '#ffe0e0', color: '#a10000' }}>
      <p>
        Pour intéragir avec la blockchain, une connexion à un wallet et un provider est nécessaire. Vous pouvez installer <a href="https://metamask.io" target="_blank">Metamask</a>.
        <br/>
        Si vous avez déjà un provider, vous pouvez vous <button onClick={web3.loadWallet}>connecter</button>.
      </p>
    </section>
  );
}
