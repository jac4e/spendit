import mongoose from 'mongoose';
import { stringify } from 'querystring';
import validator from 'validator';

const schema = new mongoose.Schema({
    date: { type: Date, required: true },
    fromid: { type: String, required: true },
    toid: { type: String, required: true },
    reason: { type: String, required: true },
    products: { type: Array, required: true},
    amount: { type: Number, required: true },
    hash: { type: String, required: true}
});
schema.set('toJSON', {
    virtuals: true
})

export default mongoose.model('Transaction',schema);