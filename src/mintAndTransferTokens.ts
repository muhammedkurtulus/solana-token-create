import * as splToken from "@solana/spl-token";
import * as web3 from "@solana/web3.js";

const PRIVATE_KEY = [
  0, //Your private key
];
const shopKey = new Uint8Array(PRIVATE_KEY);
const shopKeypair = web3.Keypair.fromSecretKey(shopKey);
const tokenAddress = new web3.PublicKey(
  "7B5muYPjzP9mCKW1dFejDMEJN8McPEkNmr16EvCqCo7R"
);
const destinationAddress = new web3.PublicKey(
  "27PF83wkyryFHV883FPrPHjBt9sD3xhRDJrhSVtPU8eB"
);

const decimals = 2;
const amount = 1000000;

(async () => {
  // Connect to cluster
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );

  // Get the token account of the fromWallet address, and if it does not exist, create it
  const fromTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    connection,
    shopKeypair,
    tokenAddress,
    shopKeypair.publicKey
  );

  // Get the token account of the toWallet address, and if it does not exist, create it
  const toTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    connection,
    shopKeypair,
    tokenAddress,
    destinationAddress
  );

  // Mint new token
  const signatureMint = await splToken.mintTo(
    connection,
    shopKeypair,
    tokenAddress,
    fromTokenAccount.address,
    shopKeypair.publicKey,
    10000000 * Math.pow(10, decimals)
  );

  // Transfer the token
  const signature = await splToken.transfer(
    connection,
    shopKeypair,
    fromTokenAccount.address,
    toTokenAccount.address,
    shopKeypair.publicKey,
    amount * Math.pow(10, decimals)
  );
  console.log(
    `Transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
})();
