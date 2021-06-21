# Smart contracts 

# Requirements

Node v10.13.0 or higher 

# Setup

    npm install

# Environnement 

In hardat.config.js import the private key of the deployer account and change the node_url

# scripts

Deploy with hardhat

    npx hardhat run --network ganache deployDocument.js

The script will output the addresses of the Permission and StudentLoan contract. Those addresses will not change even after upgrades. 


# Transfert proxy ownership

     await admin.transferProxyAdminOwnership(process.env.PROXY_ADMIN);

  ~/Library/Caches/hardhat-nodejs/compilers/macosx-amd64/
  '/home/xxx/.local/share/hardhat-nodejs/compilers/linux-amd64/