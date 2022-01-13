import { Cluster } from "@solana/web3.js";

export const DatabaseUrl = 'mongodb://localhost:27017/solana';
export const Interval: number = 10000;
export const DelayAtError: number = 1000;
export const ClusterName: Cluster = 'devnet';
export const CANDY_MACHINE_PROGRAM = 'cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ';
export const RpcUrl = {
  'devnet': 'http://api.devnet.solana.com',
  'testnet': 'http://api.testnet.solana.com',
  'mainnet-beta': 'http://api.mainnet-beta.solana.com'
}
