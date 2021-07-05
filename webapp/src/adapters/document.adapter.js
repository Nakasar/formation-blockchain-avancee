import BMF from 'browser-md5-file';

const bmf = new BMF();

class Document {
    static async instantiate(address, provider) {
        // @TODO : instancier le contrat de document avec son ABI (Human Readable Interface ou JSON).
        const documentContract = null;

        return new Document({ documentContract });
    }

    async hashDocument(file) {
        return new Promise((resolve, reject) => {
            bmf.md5(
              file,
              (err, md5) => {
                  if (err) {
                      reject(new Error('Failed to hash the document.'));
                  }

                  resolve(md5);
              },
              progress => {},
            );
        });
    }

    // get events
    // filter hash
    // get status for each hash
    async getDocuments() {
        // @TODO : Récupérer les documents émis. (Utiliser les évènements blockchain).
    }

    listenForIssuance(callback) {
        // @TODO : ajouter un listener sur l'évènement d'émission de document et appeler la callback.

        /**
         * callback({ hash, status: 1, blockNumber, timestamp, date: (ISO string of date) });
         */
    }

    removeAllListeners() {
        // @TODO : retirer tous les listener du contrat.
    }

    async issueDocument(hash) {
        // @TODO : Emettre un document.
    }

    async revokeDocument(hash) {
        // @TODO : Révoquer un document.
    }

    async verifyDocument(hash) {
        // @TODO : Récupérer le status d'un document sur le contrat.
        const status = null;

        return status;
    }

    constructor({ documentContract }) {
        this.contract = documentContract;
        this.address = documentContract.address;
    }
}

class DocumentAdapter {
    async instantiateDocument(address, provider) {
        return Document.instantiate(address, provider);
    }
}

export default DocumentAdapter;
