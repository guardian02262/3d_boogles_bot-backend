import mongoose from 'mongoose';
import * as web3 from '@solana/web3.js';

import { 
  getMachines,
  getCandyMachineState
} from './api/index';

import {
  DatabaseUrl,
  Interval,
  DelayAtError,
  ClusterName,
  RpcUrl
} from './config';

import Machine from './models/Machine'

mongoose.connect(DatabaseUrl, function(err) {
  if (err) {
    console.log('mongodb connection error!')
    process.exit(1);
  }
  console.log('mongodb is connected');
});

(async () => {
  // Declare global variables
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  
  const main = async () => {
    try {
      // Get current candymachines
      let globalMachines = await getMachines(ClusterName) || [];
      for (const machine of globalMachines) {
        let machineData = getCandyMachineState(new web3.PublicKey(machine.pubkey), new web3.Connection(RpcUrl[ClusterName]));
        console.log('machineData', machineData);
        try {
          let oldMachine = await Machine.findOne((oldM: any) => oldM.id === machine.pubkey);
          if (oldMachine) {
            await oldMachine.update({
              machineData
            })
            console.log('oldMachine', oldMachine);
          }
          else {
            let newMachine = new Machine({
              machineData
            })
            await newMachine.save();
            console.log('newMachine', newMachine);
          }
          
        }
        catch(error) {
          console.log('collectionError', error);
          await delay(DelayAtError);
          continue;
        }
      }
    }
    catch(error) {
      console.log('--error:', error);
      await delay(DelayAtError);
    }
  }

  // Fetch values periodically.
  for (let i = 0; i < 1;) {
    await main();
    await delay(Interval);
  } 
})()
