import { web3 } from "../config/web3";

/**
 * Fetches a block by its number from the Polygon Amoy network.
 * @param blockNumber The number of the block to fetch.
 * @returns A promise that resolves to the block object.
 */
export const getBlockByNumber = async (blockNumber: number | string) => {
  try {
    const block = await web3.eth.getBlock(blockNumber);
    if (!block || !block.hash) {
      throw new Error(`Block #${blockNumber} not found or hash is missing.`);
    }
    // Ensure hash is a string
    block.hash = String(block.hash);
    return block;
  } catch (error) {
    console.error(`Failed to fetch block #${blockNumber}:`, error);
    throw error;
  }
};
