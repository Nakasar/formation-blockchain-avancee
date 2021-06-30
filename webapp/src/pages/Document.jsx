import {Button, Container, TextField} from "@material-ui/core";
import {useEffect, useState} from "react";
import {useDocument} from "../contexts/document.context";
import {useWeb3} from "../contexts/web3.context";


function Document() {
    const web3 = useWeb3();
    const documentContext = useDocument();
    
    const [documentAddress, setDocumentAddress] = useState('');
    const [documentTransfersLoaded, setDocumentTransfersLoaded] = useState(false);
    
    useEffect(() => {
        if (documentContext.loaded) {
            fetchDocumentTransfers();
        }
    }, [documentContext.loaded, documentContext.document?.address])
    
    async function loadDocumentContract(event) {
        event.preventDefault();
        console.log(documentContext);
        await documentContext.loadDocument(documentAddress, web3.provider);
    }
    
    async function handleDocument(event) {
        const hash = Array.from(event).reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0);
        await documentContext.issueDocument(hash);
    }
    
    async function handleDocumentVerify(event) {
        const hash = Array.from(event).reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0);
        const status = await documentContext.verifyDocument(hash);
        console.log("status: ", status.toNumber());
    }
    
    async function fetchDocumentTransfers() {
        await documentContext.fetchDocuments();
        setDocumentTransfersLoaded(true);
    }
    
    
    if (!web3.loaded) return <p> Connect a wallet bro </p>
    
    return (
        <Container>
            <h2>Load a document contract</h2>
        
            <form onSubmit={loadDocumentContract}>
                <TextField id="document-address" label="Document address" variant="outlined" value={documentAddress} onChange={event => setDocumentAddress(event.target.value)} />
            
                <Button variant="contained" color="primary" type="submit">Load document</Button>
            </form>
            <h3> Document list </h3>
            <ul>
            { documentContext.documents.map( doc => {
                return <li key={doc.hash}> {doc.hash} | {doc.status}</li>
            }) }
            </ul>
            <Button variant="contained" component="label" >
                Upload Document
                <input type="file" hidden  onChange={event => handleDocument(event.target.value)} />
            </Button>
            <Button variant="contained" component="label" >
                Verify Document
                <input type="file" hidden  onChange={event => handleDocumentVerify(event.target.value)} />
            </Button>
        </Container>
    );
}

export default Document;