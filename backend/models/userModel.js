import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
   {
      name: {type: String, required: true},
      email: {type: String, required: true, unique: true},  // By having unique = true, mongoose will create an index in the database
      password: {type: String, required: true},
      isAdmin: {type: Boolean, default: false, required: true}
   }, 
   {
      timestamps: true,  // this tells Mongoose to create two additional fields for the record: createdAt and updatedAt
   }
);

const User = mongoose.model("User", userSchema);
export default User;