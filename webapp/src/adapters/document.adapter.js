import { ethers } from "ethers";

const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "hash",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "issuanceMade",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "hash",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "issuanceRevoked",
        "type": "event"
    },
    {
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "hash",
                "type": "string"
            }
        ],
        "name": "getStatus",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "hash",
                "type": "string"
            }
        ],
        "name": "issueDocument",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "hash",
                "type": "string"
            }
        ],
        "name": "revokeDocument",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

class Document {
    static async instantiate(address, provider) {
        const documentContract = new ethers.Contract(
            address,
            abi,
            provider,
        );
        
        const document = new Document({ documentContract });
        return document;
    }
    
    // get events
    // filter hash
    // get status for each hash
    async getDocuments() {
        const currentBlock = await this.contract.provider.getBlock();
        const documents = await this.contract.queryFilter('issuanceMade', currentBlock.number - 20);
        return await Promise.all(documents.map(document =>
            document.args[0]
        ).map( async hash => {
            const status = await this.contract.getStatus(hash);
            return {hash, status: status.toNumber() }
        }))
    }
    
    listenForIssuance(callback) {
        this.contract.on('issuanceMade', (hash, sender, event) => {
            console.log(hash, sender, event)
            callback({hash, status: 1});
        });
    }
    
    async pause(onConfirmation) {
        const signer = this.contract.provider.getSigner();
        const contractWithSigner = this.contract.connect(signer);
        const transaction = await contractWithSigner.pause();
        
        transaction.wait().then(() => {
            onConfirmation();
        });
        
        return transaction;
    }
    
    async issueDocument(hash) {
        const signer = this.contract.provider.getSigner();
        const contractWithSigner = this.contract.connect(signer);
        const transaction = await contractWithSigner.issueDocument(hash.toString());
    
        transaction.wait().then(() => {
            // onConfirmation();
            console.log("finit");
        });
    
        return transaction;
    }
    
    async revokeDocument(hash) {
        const signer = this.contract.provider.getSigner();
        const contractWithSigner = this.contract.connect(signer);
        const transaction = await contractWithSigner.revokeDocument(hash.toString());
        
        transaction.wait().then(() => {
            // onConfirmation();
            console.log("finit");
        });
        
        return transaction;
    }
    
    async verifyDocument(hash) {
        const status = await this.contract.getStatus(hash.toString());
        return status;
    }
    
    constructor({ documentContract }) {
        this.contract = documentContract;
        this.address = documentContract.address;
    }
}

class DocumentAdapter {
    async getDocumentName(address, provider) {
        const documentContract = new ethers.Contract(
            address,
            abi,
            provider,
        );
        
        return documentContract.name();
    }
    
    async instantiateDocument(address, provider) {
        return Document.instantiate(address, provider);
    }
}

export default DocumentAdapter;