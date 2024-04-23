const User = require('../models/users');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const { get } = require('mongoose');

const test = (req, res) => {
    res.json('Test is working');
}

// Register endpoint
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if name was entered
        if (!name) {
            return res.json({ error: 'Name is required' });
        }
        // Check if email was entered
        if (!email) {
            return res.json({ error: 'Email is required' });
        }
        // Check if password was entered and is at least 6 characters long
        if (!password || password.length < 6) {
            return res.json({ error: 'Password is required and should be at least 6 characters long' });
        }

        // Check if user with that email already exists
        const exists = await User.findOne({
            email
        });
        if (exists) {
            return res.json({ error: 'Email is already taken' });
        }
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        return res.json(user);
    } catch (error) {
        console.log(error);
    }
}

// Login endpoint
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if email was entered
        if (!email) {
            return res.json({ error: 'Email is required' });
        }
        // Check if password was entered
        if (!password) {
            return res.json({ error: 'Password is required' });
        }
        // Check if user with that email exists
        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.json({ error: 'Invalid email or password' });
        }
        // Check if passwords match
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.json({ error: 'Invalid email or password' });
        }
        // If passwords match, create token and set cookie
        jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, {
                httpOnly: true, // Security feature for cookies
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            }).json(user);
        });
    } catch (error) {
        console.log(error);
    }

}


const getProfile = async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.json(user);
        })
    }
    else {
        res.json(null)
    }

}
module.exports = { test, registerUser, loginUser, getProfile };