import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());

mongoose
    .connect('mongodb+srv://admin:admin@cluster0.ielym5z.mongodb.net/current-bank?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('BD error', err));

app.get('/', (req, res) => {
    res.send('hello');
});

app.post('/auth/register', (req, res) => {
   
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
