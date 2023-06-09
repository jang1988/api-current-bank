import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { bankCreateValidation, loginValidation, registerValidation } from './validations.js';

import checkAuth from './utils/checkAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

import { register, login, getMe } from './controllers/UserController.js';
import * as BankController from './controllers/BankController.js';
dotenv.config();

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/', (req, res) => {
    res.send('hello');
});

app.post('/auth/login', loginValidation, handleValidationErrors, login);
app.post('/auth/register', registerValidation, handleValidationErrors, register);
app.get('/auth/me', checkAuth, getMe);

app.post('/banks', checkAuth, bankCreateValidation, handleValidationErrors, BankController.create);
app.get('/banks', BankController.getAll);
app.get('/banks/:id', BankController.getOne);
app.delete('/banks/:id', checkAuth, BankController.remove);
app.patch('/banks/:id', checkAuth, handleValidationErrors, BankController.update);

app.get('/tags', BankController.getLastTags);
app.get('/banks/tags', BankController.getBanksByTags);

app.put('/banks/:id/count', BankController.updateCount);

app.listen(process.env.PORT || 80, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
