import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';
import { generateToken } from '../lib/utils/generateToken.js';


export const signup = async (req, res) => {
    try {
        const {fullName, username, password, email} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error: "Invalid email format"});
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({error: "Email is already exists"});
        }

        const existingUsername = await User.findOne({username});
        if(existingUsername) {
            return res.status(400).json({error: "Username is already exists"});
        }

        if(password.length < 6) {
            return res.status(400).json({error: "Password must be atleast 6 characters"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        });

        if(newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.profileImg,
            });

        } else {
            res.status(400).json({error: "Invalid user data"});
        }
        
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({error: "Internal server error"})
    }
};

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});
        const isPasswordValid = await bcrypt.compare(password, user?.password);
        if(!user || !isPasswordValid) {
            return res.status(400).json({error: "Invalid username or password"});
        };

        if(user) {
            generateToken(user._id, res);
            res.status(201).json(user);
        }

    } catch (error) {   
        console.error('Error in login controller', error.message)
        res.status(500).json({error: "Internal server error"});
    }
};

export const logout = async (req,res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});

    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getMe = async (req, res) => {
    try {
       const user = await User.findById(req.user._id).select("-password");
       res.status(200).json(user);

    } catch (error) {
       console.log("Error in getMe controller", error.message);
       res.status(500).json({error: "Internal server error"}); 
    }
};