export {User}

import mongoose from "mongoose";

// unique: true 
// was giving some deprecation
// (node:9832) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email:{
        type: String,
        required: true,
        // It does not fully check for unique,
        // But optimizes our code written in POST user request 
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    }, 
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: "user",
        enum: ["user","admin","creator"]
    }
});

// This to remove the error code:101
export interface UserDoc extends mongoose.Document {
    email:{
        type: String,
        required: true
    }, 
    password:{
        type: String,
        required: true
    }
    role:{
        type: String,
        default: "user",
        enum: ["user","admin","creator"]
    }
}

var User = mongoose.model<UserDoc>("User",userSchema);

