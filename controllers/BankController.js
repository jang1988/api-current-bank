import BankModel from '../models/Bank.js'

export const create = async (req, res) => {
    try {
      const doc = new BankModel({
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
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