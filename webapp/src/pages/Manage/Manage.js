import ContractDeployment from "./ContractDeployment";
import SimplePermissions from "./SimplePermissions";
import {useWeb3} from "../../contexts/Web3.context";
import NoProviderAlertBox from "../../components/NoProviderAlertBox";

export default function Manage() {
  const web3 = useWeb3();

  return (
    <main>
      <h1>Manage</h1>

      <p>
        Depuis cette page, un propriétaire de contrat de gestion de document doit pouvoir modifier la liste des personnes
        disposant des droits pour créer et révoquer des documents.
      </p>

      {web3.loaded ? (
        <>
          <section>
            <SimplePermissions />
          </section>

          <hr/>

          <ContractDeployment />
        </>
      ) : <NoProviderAlertBox />}
    </main>
  );
}
