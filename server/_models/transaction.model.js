import mongoose from 'mongoose';
import validator from 'validator';

const schema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    accountid: {
        type: String,
        required: true
    },
    // toid: { type: String, required: true },
    type: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        required: true
    },
    total: {
        type: String,
        required: true
    },
    // hash: { type: String, required: true}
});
schema.set('toJSON', {
    virtuals: true,
    transform: transformDoc
})

schema.post(['find', 'findOne', 'findOneAndUpdate'], function (res) {
    if (!this.mongooseOptions().lean) {
        return;
    }
    if (Array.isArray(res)) {
        res.forEach(transformDoc);
        return;
    }
    transformDoc(res);
});

function transformDoc(doc, ret) {
    doc.id = doc._id.toString();
    delete doc._id;
    delete doc.__v;
}

export default mongoose.model('Transaction', schema);