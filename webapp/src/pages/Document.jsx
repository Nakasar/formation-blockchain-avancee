import {Button, Container, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@material-ui/core";
import {useEffect, useState} from "react";
import {useDocument} from "../contexts/document.context";
import {useWeb3} from "../contexts/web3.context";


function Document() {
  const web3 = useWeb3();
  const documentContext = useDocument();

  const [documentTransfersLoaded, setDocumentTransfersLoaded] = useState(false);

  useEffect(() => {
    if (documentContext.loaded) {
      fetchDocumentTransfers();
    }
  }, [documentContext.loaded, documentContext.document?.address])

  async function loadDocumentContract() {
    await documentContext.loadDocumentContract(web3.provider);
  }

  async function unloadDocumentContract() {
    await documentContext.unloadDocumentContract();
  }

  async function handleDocument(event) {
    const hash = Array.from(event).reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0);
    await documentContext.issueDocument(hash);
  }

  async function handleRevokeDocument(event, hash) {
    await documentContext.revokeDocument(hash);
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
      <h2>Document contract</h2>

      {documentContext.loaded ? (
        <>
          <p>Document contract loaded at {documentContext.documentContract.address}</p>
          <Button variant="contained" color="secondary" onClick={unloadDocumentContract}>Unload document
            contract</Button>
        </>
      ) : (
        <>
          <p>This will use the document contract address of the network you have selected.</p>
          <Button variant="contained" color="primary" onClick={loadDocumentContract}>Load document contract</Button>
        </>
      )}

      <h3> Document list </h3>

      {documentContext.loaded && (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Document hash</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Issuance date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documentContext.documents.map(doc =>
                <TableRow>
                  <TableCell>{doc.hash}</TableCell>
                  <TableCell>{doc.status}</TableCell>
                  <TableCell>{doc.date.toISOString()}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" component="label"
                            onClick={event => handleRevokeDocument(event, doc.hash)}>
                      revoke document
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Button variant="contained" color="primary" component="label">
            Upload Document
            <input type="file" hidden onChange={event => handleDocument(event.target.value)}/>
          </Button>
          <Button varia nt="contained" component="label">
            Verify Document
            <input type="file" hidden onChange={event => handleDocumentVerify(event.target.value)}/>
          </Button>
        </>
      )}
    </Container>
  );
}

export default Document;
