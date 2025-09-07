import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true, //Without an index → MongoDB has to scan every document in the collection to find matches (collection scan).
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshtoken: {
            type: String,
        },
        cart: [
            {
              itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
              quantity: { type: Number, default: 1 }
            }
          ]
    },{timestamps: true}
)

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
}); 
//save se pehle encrypt krana hai aur async is liye kyuki
// time lgta hai encrpytion wagera mai

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
    {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d"
    }
)
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
    {
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d"
    }
)
}

export const User = mongoose.model("User", userSchema); 



