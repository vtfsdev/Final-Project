import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import { generateToken, isAuth } from '../utils.js';

const userRouter = express.Router();

userRouter.get('/seed', 
   expressAsyncHandler(async (req, res) => {
      // The below line of code is for test purposes. It's purpose is to remove
      // the loading error when the page is refreshed. The loading error occurs 
      // because a duplicate record is being created. In prod apps, you 
      // should not remove all the users.
      //wait User.remove({});
      const createdUsers = await User.insertMany(data.users);
      res.send({ createdUsers });
   })
);

userRouter.post(
   '/signin', 
   expressAsyncHandler(async (req, res) => {
      const user = await User.findOne({email: req.body.email});
      if(user) {
         if(bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
               _id: user.id,
               name: user.name,
               email: user.email,
               isAdmin: user.isAdmin,
               token: generateToken(user),
            });
            return;
         }
      }
      res.status(401).send({ message: 'Invalid email or password' });
   })
);

// As always, expressAsyncHandler used to handle async functions
userRouter.post(
   '/register', 
   expressAsyncHandler(async(req, res) => {
      const user = new User ({
         name: req.body.name, 
         email: req.body.email,
         password: bcrypt.hashSync(req.body.password, 8),
      });
      const createdUser = await user.save();
      res.send({
         _id: createdUser.id,
         name: createdUser.name,
         email: createdUser.email,
         isAdmin: createdUser.isAdmin,
         token: generateToken(createdUser),
      });
   })
);

userRouter.get(
   '/:id', 
   expressAsyncHandler(async(req, res) => {
      const user = await User.findById(req.params.id);
      if(user) {
         res.send(user);
      } else {
         res.status(404).send({ message: 'User Not Found' }) ;
      } 
   })
);

// isAuth means allow only authenticated users to update(i.e. put)
userRouter.put(
   '/profile', 
   isAuth, 
   expressAsyncHandler(async(req, res) => {
      const user = await User.findById(req.user._id); // Find the _id of the logged in user
      if(user) {
         user.name = req.body.name || user.name;   // Update the user name
         user.email = req.body.email || user.email;   // Update the email
         if(req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
         }
         const updatedUser = await user.save();
         res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser),
         });
      }
   })
);

export default userRouter;