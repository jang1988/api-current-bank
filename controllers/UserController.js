import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';


export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            avatarUrl: req.body.avatarUrl,
            passwordHash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secretKey',
            {
                expiresIn: '30d',
            },
        );

        res.json({
            ...user._doc,
            token,
        });
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        });
    }
}

export const login = async (req, res) => {
    try {

        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({
                message: 'Пользователь не найден',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Не верный пароль',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secretKey',
            {
                expiresIn: '30d',
            },
        );

        res.json({
            ...user._doc,
            token,
        });
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        });
    }
}

export const getMe = async (req, res) => {
    try {

        const user = await UserModel.findById(req.userId)

        if (!user) { 
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        res.json(user._doc);
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Нет доступа',
        });
    }
}