const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');
const Sale = require('../models/sale');
const User = require('../models/user.js')

router.post('/create', async (req, res) => {
    try {
        const saleData = req.body;
        saleData._id = uuid();
        
        const newSale = await new Sale(saleData).save();

        await User.updateOne({ _id: saleData.userId }, { $set: { isActive: false } });
        
        res.status(201).json(newSale);
    } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR" });
    }
});

module.exports = router;