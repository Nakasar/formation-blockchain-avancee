import React from 'react';
import DocumentAdapter from "../adapters/document.adapter";

const documentAdapter = new DocumentAdapter();

const DocumentContext = React.createContext({ loaded: false });

function DocumentContextProvider(props) {
    const [loaded, setLoaded] = React.useState(false);
    const [document, setDocument] = React.useState(null);
    const [documents, dispatchDocuments] = React.useReducer((state, action) => {
        switch (action.action) {
            case 'ADD':
                return [...state, action.document];
            case 'SET':
                return action.documents;
        }
    }, []);
    
    async function loadDocument(documentAddress, provider) {
        const document = await documentAdapter.instantiateDocument(documentAddress, provider);
        setDocument(document);
        setLoaded(true);
        
        document.listenForIssuance((document) => {
            dispatchDocuments({
                action: 'ADD',
                document,
            });
        });
    }
    
    async function fetchDocuments() {
        dispatchDocuments({
            action: 'SET',
            documents: await document.getDocuments() ?? [],
        });
    }
    
    async function issueDocument(hash) {
        await document.issueDocument(hash);
    }
    
    async function verifyDocument(hash) {
        return await document.verifyDocument(hash);
    }

    const value = {
        loaded,
        document,
        documents,
        loadDocument,
        fetchDocuments,
        issueDocument,
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