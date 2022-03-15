import mongoose from 'mongoose';
import validator from 'validator';

const schema = new mongoose.Schema({
    date: { type: Date, required: true },
    ccid: { type: String, required: true },
    type: { type: String, required: true },
    reason: { type: String, required: true },
    products: { type: Array, required: true},
    amount: { type: Number, required: true }
});
schema.set('toJSON', {
    virtuals: true
})

export default mongoose.model('Transaction',schema);