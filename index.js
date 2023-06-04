import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello');
});

app.post('/auth/login', (req, res) => {
    console.log('req: ', req.body)
    const token = jwt.sign(
        {
            email: req.body.email,
            password: req.body.password,
        },
        'secretKey',
    );

    res.json({
        token,
        succes: true,
    });
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
