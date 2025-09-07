import { apiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId)=>{
    try{
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshtoken = refreshToken;// saving refresh token to db(models/user.model.js)
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};
    }

    catch(error){
        throw new apiError(500, "Token generation failed");
    }
}

const registerUser = asyncHandler(async(req,res) => {
    const{fullName, email, username, password} = req.body
    console.log("email: ",email);

    if(fullName === ""){
        throw new apiError(400, "Full name is required");
    }
    
    if(email === ""){
        throw new apiError(400, "Email is required");
    }

    if(username === ""){
        throw new apiError(400, "Username is required");
    }

    if(password === ""){
        throw new apiError(400, "Password is required");
    }

    const existedUser = await User.findOne({
        $or: [{email}, {username}]
        //to check if user exist or not with this email and username
    })

    if(existedUser){
        throw new apiError(409, "User already exists with this email or username");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
    })
    

    const createdUser = await User.findById(user._id)
    .select("-password -refreshtoken") //- means exclude

    if(!createdUser){
        throw new apiError(500, "User creation failed");
    }

    return res.status(201).json(
        new apiResponse(200, "User created successfully", createdUser)                        
    )

})

const loginUser = asyncHandler(async(req,res) => {
    const {email, username, password} = req.body

    if(!email && !username){
        throw new apiError(400, "Email and username are required");
    }

    const user = await User.findOne({
        $or: [{email}, {username}]
    })

    if(!user){
        throw new apiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)  //ye method user model mai bana hua hai

    if(!isPasswordValid){
        throw new apiError(401, "Invalid password");
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshtoken")

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    // Set cookies → access & refresh tokens stored on client securely.
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new apiResponse(
                200,
                "User logged in successfully",
                {
                    user: loggedInUser,accessToken,
                    refreshToken
                }
            )
        )
})

const logoutUser = asyncHandler(async(req,res) => {
    //clear cookies
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshtoken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new apiResponse(
            200,{},
            "User logged out successfully"
        )
    )
})

const refreshAccessToken = asyncHandler(async(req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new apiError(400, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new apiError(401, "Invalid refresh token");
        }
    
        if(incomingRefreshToken !== user?.refreshtoken){
            throw new apiError(401, "Refresh token is expired or used");
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", newRefreshToken)
        .json(
            new apiResponse(
                200,
                {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "Tokens refreshed successfully"
                
            )
        )
    } 
    catch (error) {
        throw new apiError(401, "Invalid refresh token");
    }
})

export {
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
};