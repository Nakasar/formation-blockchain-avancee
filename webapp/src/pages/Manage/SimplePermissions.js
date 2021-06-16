import {useEffect, useReducer, useState} from "react";

export default function SimplePermissions() {
  const [authorizedAddresses, updateAuthorizedAddresses] = useReducer((state, action) => {
    const stateCopy = [...state];
    switch (action.type) {
      case 'set':
        return action.addresses;
      case 'add':
        return [...state, action.address];
      case 'setAdded':
        const toSetAdded = state.find(candidate => candidate.address === action.address);
        toSetAdded.adding = false;

        return [...state];
      case 'delete':
        const toDelete = state.findIndex(candidate => candidate.address === action.address);
        stateCopy.splice(toDelete, 1);

        return stateCopy;
      case 'setDeleting':
        const tosetDeleting = state.find(candidate => candidate.address === action.address);
        tosetDeleting.deleting = true;

        return [...state];
      default:
        throw new Error('Unknown reducer action called.');
    }
  }, []);
  const [addressToAdd, setAddressToAdd] = useState('');

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    // @TODO Retrieve list of authorized addresses.
    console.log('Retrieve list of authorized addresses.');

    updateAuthorizedAddresses({
      type: 'set',
      addresses: [{ address: '0xbEA1e86d493116615eef93559B1c2e6E02620601' }, { address: '0x13A4CC8Dc7a98A1c6A064E83504C6Bbc45a299aC' }],
    });
  }

  async function deleteAddress(address) {
    // @TODO Send delete authorized address transaction
    console.log('Send delete authorized address transaction');

    updateAuthorizedAddresses({
      type: 'setDeleting',
      address,
      transactionHash: '0x...',
    });

    setTimeout(() => {
      console.log('Transaction confirmed');

      updateAuthorizedAddresses({
        type: 'delete',
        address,
      });
    }, 2000);
  }

  async function addAddress() {
    // @TODO Send add authorized address transaction.
    console.log('Send add authorized address transaction.');

    updateAuthorizedAddresses({
      type: 'add',
      address: {
        address: addressToAdd,
        adding: true,
      },
    });

    setTimeout(() => {
      console.log('Transaction confirmed');

      updateAuthorizedAddresses({
        type: 'setAdded',
        address: addressToAdd,
      });
      setAddressToAdd('');
    }, 2000);
  }

  return (
    <div>
      <h2>Adresses autorisées :</h2>

      <ul>
        {authorizedAddresses.map(address => (
          <li key={address.address}>
            {address.address}
            {(!address.deleting && !address.adding) && <button onClick={() => deleteAddress(address.address)}>Supprimer</button>}
            {address.deleting && <button disabled>Suppression...</button>}
            {address.adding && <button disabled>Ajout...</button>}
          </li>))}
      </ul>

      <button onClick={refresh}>Rafraîchir</button>

      <input type="text" placeholder="0x..." value={addressToAdd} onChange={event => setAddressToAdd(event.target.value)}/>
      <button onClick={addAddress}>Autoriser une nouvelle adresse</button>
    </div>
  );
}
