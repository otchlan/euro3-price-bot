// src/DataRetriever.ts
import { ethers } from 'ethers';
import { formatUnits } from '@ethersproject/units'; // Importing formatUnits from the correct module
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Load ABI
const ABIPath = path.join(__dirname, '..', 'contracts', 'abis', 'LiquidityPoolABI.json');
const CONTRACT_ABI = JSON.parse(fs.readFileSync(ABIPath, 'utf-8'));

// Addresses
const CONTRACT_ADDRESS = '0xacE89Ad89B1d374fd4D198C3CC62e9ab1dB717D1'; // Replace with your contract address

// Setup provider
const provider = new ethers.JsonRpcProvider(process.env.L2_RPC_URL);

// Create contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

// Function to fetch global state
async function fetchGlobalState() {
  try {
    console.log('Connecting to Ethereum provider...');
    await provider.ready; // Ensure the provider is ready
    console.log('Ethereum provider connected.');

    console.log(`Fetching global state from contract at address: ${CONTRACT_ADDRESS}...`);
    const globalState = await contract.globalState();
    console.log('Fetched global state:', globalState);

    return globalState;
  } catch (error) {
    console.error('Error fetching global state:', error);
    throw error;
  }
}

// Function to calculate price from sqrtPriceX96
function calculatePrice(sqrtPriceX96: bigint, decimals0: number, decimals1: number): string {
  // Convert sqrtPriceX96 to price
  const priceX96 = (sqrtPriceX96 * sqrtPriceX96) / (BigInt(2) ** BigInt(192));
  // Adjust for decimals
  const adjustedPrice = formatUnits(priceX96.toString(), decimals1 - decimals0);
  return adjustedPrice;
}

// Function to retrieve data
export async function retrieveData(): Promise<string> {
  try {
    const globalState = await fetchGlobalState();

    // Assuming token0 is USDC (6 decimals) and token1 is EURO3 (18 decimals)
    const decimals0 = 6;  // USDC decimals
    const decimals1 = 18; // EURO3 decimals
    const sqrtPriceX96 = globalState[0];
    const price = calculatePrice(sqrtPriceX96, decimals0, decimals1);

    return price;
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
}
