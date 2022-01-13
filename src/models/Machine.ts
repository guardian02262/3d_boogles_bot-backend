import { Schema, model } from 'mongoose';
import Machine from '../interfaces/Machine';

const machineSchema = new Schema<Machine>({
    id: {
      type: String,
      required: true,
      unique: true
    },
    itemsAvailable: {
      type: Number,
      required: true,
    },
    itemsRedeemed: {
      type: Number,
      required: true
    },
    itemsRemaining: {
      type: Number,
      required: true
    },
    goLiveDate: {
      type: Object,
      required: true
    },
    treasury: {
      type: Object,
      required: true,
    },
    tokenMint: {
      type: Object,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    price: {
      type: Object,
      required: true
    }
});

const CollectionModel = model<Machine>('machine', machineSchema);

export default CollectionModel; 