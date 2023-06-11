import express from 'express';
import mongoose from 'mongoose';
import { registerValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';

import { register, login, getMe } from './controllers/UserController.js';

const app = express();

app.use(express.json());

mongoose
    .connect(
        'mongodb+srv://admin:admin@cluster0.ielym5z.mongodb.net/current-bank?retryWrites=true&w=majority',
    )
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('BD error', err));

app.get('/', (req, res) => {
    res.send('hello');
});

app.post('/auth/login', login);

app.post('/auth/register', registerValidation, register);

app.get('/auth/me', checkAuth, getMe);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
