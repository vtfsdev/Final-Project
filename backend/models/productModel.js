import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
   {
      name: {type: String, required: true, unique: true}, // By having unique = true, mongoose will create an index in the database
      image: {type: String, required: true},
      brand: {type: String, required: true},
      category: {type: String, required: true},
      description: {type: String, required: true},
      price: {type: Number, required: true},
      countInStock: {type: Number, required: true},
      rating: {type: Number, required: true},
      numReviews: {type: Number, required: true},
   }, 
   {
      timestamps: true,  // this tells Mongoose to create two additional fields for the record: createdAt and updatedAt
   }
);

const Product = mongoose.model("Product", productSchema);
export default Product;