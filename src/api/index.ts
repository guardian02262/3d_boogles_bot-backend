import axios from 'axios';
import * as anchor from '@project-serum/anchor';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import secret from '../config/keypair.json';
import { 
  RpcUrl,
  CANDY_MACHINE_PROGRAM
 } from '../config';
import { NodeWallet, Wallet } from '@metaplex/js';

/**
 * Returns candy machine addresses.
 *
 * @param {Cluster} cluster - Solana Cluster.
 * @returns {Array} Return array of token accounts. 
 */
const getMachines = async (cluster: Cluster) => {
  console.log('url', RpcUrl[cluster])
  const res = await axios.post(RpcUrl[cluster], {
    jsonrpc: "2.0",
    id: 1,
    method: "getProgramAccounts",
    params: [
      CANDY_MACHINE_PROGRAM, //program address
      {
        encoding: "jsonParsed",
      }
    ]
  });
  return res.data.result;
}

/**
 * Returns candy machine data.
 *
 * @param {Cluster} cluster - Solana Cluster.
 * @param {String} machineAddress - Candy machine Address.
 * @returns {Array} Return array of signatures. 
 */
 const getCandyMachineState = async (
  candyMachineId: anchor.web3.PublicKey,
  connection: anchor.web3.Connection,
) => {
  const provider = new anchor.Provider(connection, new NodeWallet(Keypair.fromSecretKey(Uint8Array.from(secret))), {
    preflightCommitment: 'recent',
  });

  const idl = await anchor.Program.fetchIdl(new PublicKey(CANDY_MACHINE_PROGRAM), provider);
  if (!idl) return null;
  const program = new anchor.Program(idl, CANDY_MACHINE_PROGRAM, provider);

  const state: any = await program.account.candyMachine.fetch(candyMachineId);
  const itemsAvailable = state.data.itemsAvailable.toNumber();
  const itemsRedeemed = state.itemsRedeemed.toNumber();
  const itemsRemaining = itemsAvailable - itemsRedeemed;

  return {
    id: candyMachineId,
    itemsAvailable,
    itemsRedeemed,
    itemsRemaining,
    goLiveDate: state.data.goLiveDate,
    treasury: state.wallet,
    tokenMint: state.tokenMint,
    config: state.config,
    price: state.data.price,
  };
};

export {
  getMachines,
  getCandyMachineState
}