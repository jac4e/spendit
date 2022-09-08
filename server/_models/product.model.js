import mongoose from 'mongoose';
import validator from 'validator';

const schema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String
    },
    price: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
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

function transformDoc(doc) {
    doc.id = doc._id.toString();
    delete doc._id;
    delete doc.__v;
}

export default mongoose.model('Product', schema);