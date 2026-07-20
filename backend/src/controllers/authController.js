"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.loginUser = exports.registerUser = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};
const registerUser = async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;
        // Check if user exists
        const userExists = await User_1.default.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            res.status(400).json({ message: 'User with this email or username already exists' });
            return;
        }
        // Password validation (8 chars, upper, lower, number, special)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            res.status(400).json({ message: 'Password does not meet complexity requirements' });
            return;
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        // Create user
        const user = await User_1.default.create({
            username,
            email,
            passwordHash,
            fullName,
        });
        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                token: generateToken(user.id),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be email or username
        // Find user by email or username
        const user = await User_1.default.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });
        if (user && (await bcryptjs_1.default.compare(password, user.passwordHash))) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                token: generateToken(user.id),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
};
exports.loginUser = loginUser;
const getMe = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id).select('-passwordHash');
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=authController.js.map