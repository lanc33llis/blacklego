const solanaWeb3 = require("@solana/web3.js");
const searchAddress = "FsnmHns7Vu5uiqsW93GWRWpZBXXNcdQD7gfkaDarveFZ"; //example 'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg'

const endpoint =
  "https://falling-blissful-dinghy.solana-mainnet.discover.quiknode.pro/36baeda596a9090423745f7b3fe3444f86f63655/";
const solanaConnection = new solanaWeb3.Connection(endpoint);

const getTransactions = async (address, numTx) => {
  const pubKey = new solanaWeb3.PublicKey(address);
  let transactionList = await solanaConnection.getSignaturesForAddress(pubKey, {
    limit: numTx,
  });
  transactionList.forEach((transaction, i) => {
    const date = new Date(transaction.blockTime * 1000);
    console.log(`Transaction No: ${i + 1}`);
    console.log(`Signature: ${transaction.signature}`);
    console.log(`Time: ${date}`);
    console.log(`Status: ${transaction.confirmationStatus}`);
    console.log("-".repeat(20));
  });
};

getTransactions(searchAddress, 3);
