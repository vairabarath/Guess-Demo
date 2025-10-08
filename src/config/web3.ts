import Web3 from "web3";

// Initialize Web3 with the Polygon Amoy RPC endpoint
const RPC_URL =
  "https://polygon-amoy.infura.io/v3/15817b570c64442b8913e5d031b6ee29";

export const web3 = new Web3(RPC_URL);
