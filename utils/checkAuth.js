import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s/, '');

    if (token) {
        try {
            const decoder = jwt.verify(token, 'secretKey');

            req.userId = decoder._id;

            next()
        } catch (error) {
            console.log('error: ', error);
            return res.status(403).json({
                message: 'Нет доступа',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }


};
