import NoProviderAlertBox from "../../components/NoProviderAlertBox";
import {useWeb3} from "../../contexts/Web3.context";

export default function Issue() {
  const web3 = useWeb3();

  return (
    <main>
      <h1>Issue</h1>

      <p>
        Depuis cette page, un émetteur de document doit pouvoir générer le hash d'un fichier et l'enregistrer dans le
        contract de gestion de documents.
        <br/>
        Vous devez vous assurer que l'émetteur possède les droits pour enregistrer le document avant de lui laisser la
        possibilité de le faire.
      </p>

      {web3.loaded ? (
        <>

        </>
      ) : <NoProviderAlertBox />}
    </main>
  );
}
