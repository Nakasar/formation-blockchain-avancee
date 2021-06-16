import {useWeb3} from "../../contexts/Web3.context";
import NoProviderAlertBox from "../../components/NoProviderAlertBox";

export default function Verify() {
  const web3 = useWeb3();

  return (
    <main>
      <h1>Verify</h1>

      <p>
        Depuis cette page, une personne en possession d'un document doit pouvoir vérifier sa validité.
        <br/>
        Pour ce faire, vous devez d'abord vérifier l'intégrité du document, puis sa non-révocation.
      </p>

      {web3.loaded ? (
        <>

        </>
      ) : <NoProviderAlertBox />}
    </main>
  );
}
