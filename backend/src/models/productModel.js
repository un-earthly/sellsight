// Products schema
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: String,
    category: String,
    subcategory: String,
    price: Number,
    sales: Number,
    rating: Number,
    reviews: Number,
    last_update: String,
    author: String,
    tags: [String],
    scraped_at: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);
