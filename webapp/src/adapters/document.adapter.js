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
    
    async getDocuments() {
        const currentBlock = await this.contract.provider.getBlock();
        const documents = await this.contract.queryFilter('issuanceMade', currentBlock.number - 20);
        console.log(documents);
        return documents;
    }
    
    listenForIssuance(callback) {
        this.contract.on('issuanceMade', (hash, sender, event) => {
            console.log(event)
            callback(event);
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