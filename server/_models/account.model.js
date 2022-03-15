import mongoose from 'mongoose';
import validator from 'validator';

const schema = new mongoose.Schema({
    roles: { type: Array, required: true },
    balance: { type: Number },
    ccid: { type: String, unique: true, required: true},
    hash: { type: String, required: true }
});
schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
})

export default mongoose.model('Account',schema);