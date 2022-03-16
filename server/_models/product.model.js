import mongoose from 'mongoose';
import validator from 'validator';

const schema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    description: { type: String, required: false },
    image: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
});
schema.set('toJSON', {
    virtuals: true
})

export default mongoose.model('Product',schema);