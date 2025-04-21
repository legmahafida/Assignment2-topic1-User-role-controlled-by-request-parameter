//config.js
import mongoose from 'mongoose';
const connect = mongoose.connect("mongodb+srv://abir:4444@cluster0.jnoswv7.mongodb.net/Login-tut?retryWrites=true&w=majority&appName=Cluster0");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    role: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// collection part
const User  = new mongoose.model("users", Loginschema);

export default User ;