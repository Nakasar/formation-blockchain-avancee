import ContractDeployment from "./ContractDeployment";
import SimplePermissions from "./SimplePermissions";

export default function Manage() {
  return (
    <main>
      <h1>Manage</h1>

      <section>
        <p>
          Depuis cette page, un propriétaire de contrat de gestion de document doit pouvoir modifier la liste des personnes
          disposant des droits pour créer et révoquer des documents.
        </p>

        <SimplePermissions />
      </section>

      <hr/>

      <ContractDeployment />
    </main>
  );
}
