import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import data from './data.js'; // This line is not needed since it's already in the routers
import productRouter from './routers/productRouter.js';
import userRouter from './routers/userRouter.js';
import orderRouter from './routers/orderRouter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/final-project', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
});

// Following code lines are for accessing static data and not from mongoDB.
// app.get('/api/products/:id', (req, res) => {
//    const product = data.products.find( (x) => x._id === req.params.id );
//    if (product) {
//       res.send(product);
//    } else {
//       res.status(404).send({ message: 'Product not Found' });
//    }
// });
//
// app.get('/api/products', (req, res) => {
//    res.send(data.products);
// });


app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.get('/api/config/paypal', (req, res) => {
   res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
});
app.get('/', (req, res) =>{
   res.send('Server is ready');
});

const port = process.env.PORT || 5000;

app.listen(port, () =>{
   console.log(`Serve at http://localhost:${port}`);
});

app.use((err, req, res, next) => {
   res.status(500).send({ message: err.message });
});