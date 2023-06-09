import BankModel from '../models/Bank.js';

export const create = async (req, res) => {
    try {
        const doc = new BankModel({
            title: req.body.title,
            text: req.body.text,
            volume: req.body.volume,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
            count: 0,
        });

        const bank = await doc.save();

        res.json(bank);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать банку',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const banks = await BankModel.find().populate('user').exec();
        res.json(banks);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить банки',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const bankId = req.params.id;

        BankModel.findOneAndUpdate(
            {
                _id: bankId,
            },
            {
                $inc: {
                    viewsCount: 1,
                },
            },
            {
                returnDocument: 'after',
            },
        )
            .populate('user')
            .then((doc) => {
                if (!doc) {
                    return res.status(404).json({
                        message: 'Банка не найдена',
                    });
                }
                res.json(doc);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    message: 'Не удалось найти банку',
                });
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить банку',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const bankId = req.params.id;

        BankModel.findOneAndDelete({
            _id: bankId,
        })
            .then((doc) => {
                if (!doc) {
                    return res.status(404).json({
                        message: 'Банка не найдена',
                    });
                }
                res.json({
                    message: true,
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    message: 'Не удалось найти банку',
                });
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить банку',
        });
    }
};

export const update = async (req, res) => {
    try {
        const bankId = req.params.id;

        await BankModel.updateOne(
            {
                _id: bankId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags.split(','),
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};

const getBankTags = (banks) => {
    const tagsSet = new Set();
  
    banks.forEach((bank) => {
      bank.tags.forEach((tag) => {
        tagsSet.add(tag);
      });
    });
  
    const tags = Array.from(tagsSet);
    return tags;
  };
  
  export const getLastTags = async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const banks = await BankModel.find().limit(Number(limit)).exec();
      const tags = getBankTags(banks);
      res.json(tags);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить тэги',
      });
    }
  };

export const getBanksByTags = async (req, res) => {
    try {
        const tags = req.query.tags.split(',');

        const banks = await BankModel.find({ tags: { $in: tags } }).populate('user').exec();
        console.log('banks: ', banks)

        res.json(banks);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить банки по тегам',
        });
    }
};

export const updateCount = async (req, res) => {
    try {
        const bankId = req.params.id;

        const countValue = req.body.count; // Получаем значение count из запроса

        const updatedBank = await BankModel.findByIdAndUpdate(
            bankId,
            { count: countValue }, // Заменяем значение count на переданное значение
            { new: true }
        );

        if (!updatedBank) {
            return res.status(404).json({
                message: 'Банка не найдена',
            });
        }

        res.json(updatedBank);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить банку',
        });
    }
};
