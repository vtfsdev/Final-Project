import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';

const productRouter = express.Router();

productRouter.get(
   '/', 
   expressAsyncHandler(async (req, res) => {
      const products = await Product.find({});
      res.send(products);
   })
);

productRouter.get('/seed', 
   expressAsyncHandler(async (req, res) => {
      // The below line of code is for test purposes. It's purpose is to remove
      // the loading error when the page is refreshed. The loading error occurs 
      // because a duplicate record is being created. In prod apps, you 
      // should not remove all the products.
      //wait Product.remove({});
      const createdProducts = await Product.insertMany(data.products);
      res.send({ createdProducts });
   })
);

// API for product details
productRouter.get(
   '/:id', 
   expressAsyncHandler(async (req, res) => {
      const product = await Product.findById(req.params.id);
      if(product) {
         res.send(product);
      } else {
         res.status(404).send({ message: 'Product Not Found' });
      }
   })
);

export default productRouter;