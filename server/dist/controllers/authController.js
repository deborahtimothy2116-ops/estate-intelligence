"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const env_1 = require("../config/env");
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, env_1.config.jwtSecret, { expiresIn: '7d' });
};
class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password, role, phone, agencyName } = req.body;
            const existingUser = await User_1.User.findOne({ email });
            if (existingUser) {
                res.status(400).json({ success: false, message: 'Email address already registered.' });
                return;
            }
            const user = await User_1.User.create({
                name,
                email,
                password,
                role: role || 'BUYER',
                phone: phone || '',
                agencyName: agencyName || '',
            });
            const token = generateToken(user._id.toString(), user.role);
            res.status(201).json({
                success: true,
                message: 'Registration successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    agencyName: user.agencyName,
                    avatar: user.avatar,
                },
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User_1.User.findOne({ email }).select('+password');
            if (!user) {
                res.status(401).json({ success: false, message: 'Invalid credentials.' });
                return;
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                res.status(401).json({ success: false, message: 'Invalid credentials.' });
                return;
            }
            const token = generateToken(user._id.toString(), user.role);
            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    agencyName: user.agencyName,
                    avatar: user.avatar,
                },
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Server error during login' });
        }
    }
    static async getMe(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'User not authenticated' });
                return;
            }
            res.json({
                success: true,
                user: {
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role,
                    phone: req.user.phone,
                    agencyName: req.user.agencyName,
                    avatar: req.user.avatar,
                    compareList: req.user.compareList,
                },
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async logout(req, res) {
        res.json({ success: true, message: 'Logged out successfully' });
    }
    static async updateProfile(req, res) {
        try {
            if (!req.userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const { name, phone, agencyName, avatar } = req.body;
            const user = await User_1.User.findByIdAndUpdate(req.userId, { $set: { name, phone, agencyName, avatar } }, { new: true });
            res.json({
                success: true,
                user: {
                    id: user?._id,
                    name: user?.name,
                    email: user?.email,
                    role: user?.role,
                    phone: user?.phone,
                    agencyName: user?.agencyName,
                    avatar: user?.avatar,
                },
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.AuthController = AuthController;
