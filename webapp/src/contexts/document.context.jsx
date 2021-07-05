import React from 'react';
import DocumentAdapter from "../adapters/document.adapter";

const documentAdapter = new DocumentAdapter();

const DocumentContext = React.createContext({ loaded: false });

const documentContracts = {
    1337: '0x08302DEeEefEEd76B63a2b80c5Ca20873774AD79',
};

function DocumentContextProvider(props) {
    const [loaded, setLoaded] = React.useState(false);
    const [documentContract, setDocumentContract] = React.useState(null);
    const [documents, dispatchDocuments] = React.useReducer((state, action) => {
        switch (action.action) {
            case 'ADD':
                return [...state, action.document];
            case 'SET':
                return action.documents;
        }
    }, []);

    async function loadDocumentContract(provider) {
        const network = await provider.getNetwork();

        if (!documentContracts[network.chainId]) {
            throw new Error(`No document contrat for this network: ${network.chainId}.`);
        }

        const contract = await documentAdapter.instantiateDocument(documentContracts[network.chainId], provider);
        setDocumentContract(contract);
        setLoaded(true);

        contract.listenForIssuance((document) => {
            dispatchDocuments({
                action: 'ADD',
                document,
            });
        });
    }

    async function unloadDocumentContract() {
        setLoaded(false);
        documentContract.removeAllListeners();
        dispatchDocuments({
            action: 'SET',
            documents: [],
        });
        setDocumentContract(null);
    }

    async function fetchDocuments() {
        dispatchDocuments({
            action: 'SET',
            documents: await documentContract.getDocuments() ?? [],
        });
    }

    async function issueDocument(hash) {
        await documentContract.issueDocument(hash);
    }

    async function revokeDocument(hash) {
        await documentContract.revokeDocument(hash);
    }

    async function verifyDocument(hash) {
        return documentContract.verifyDocument(hash);
    }

    const value = {
        loaded,
        documentContract,
        documents,
        loadDocumentContract,
        unloadDocumentContract,
        fetchDocuments,
        issueDocument,
        revokeDocument,
        verifyDocument
    };

    return (
        <DocumentContext.Provider value={value}>{props.children}</DocumentContext.Provider>
    );
}

const DocumentContextConsumer = DocumentContext.Consumer;

export const withDocument = Component => props => (
    <DocumentContextConsumer>
        {value => <Component {...props} documentContext={value} />}
    </DocumentContextConsumer>
);

export default DocumentContext;

export {DocumentContextConsumer, DocumentContextProvider};

export const useDocument = () => React.useContext(DocumentContext);
