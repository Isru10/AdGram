import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({

    email:{type:String, required:true, unique:true},
    password:{type:String, required:false},
    name:{type:String, required:true},
    emailVerified:{type:Boolean, default:false},
    verificationToken:{type:String},
    role:{type:String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User' // Each item in this array is the ID of a user who liked this user.
    }],
    dislikes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],

},
{ timestamps:true }
)


export default mongoose.models.User || mongoose.model('User', UserSchema); 