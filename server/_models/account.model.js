import mongoose from 'mongoose';
import validator from 'validator';

const schema = new mongoose.Schema({
    role: { type: String, required: true },
    ccid: { type: String, unique: true, required: true},
    hash: { type: String, required: true },
    sessionid: { type: String, unique: true, required: true }
});
schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
        delete ret.sessionid;
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
    delete doc.hash;
    delete doc.sessionid;
}

export default mongoose.model('Account',schema);