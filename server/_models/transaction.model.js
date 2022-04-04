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
    amount: {
        type: Number,
        required: true
    },
    // hash: { type: String, required: true}
});
schema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete doc.__v;
    }
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

function transformDoc(doc) {
    doc.id = doc._id.toString();
    delete doc._id;
    delete doc.__v;
}

export default mongoose.model('Transaction', schema);