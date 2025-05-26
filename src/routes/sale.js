const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');
const Sale = require('../models/sale');

router.post('/create', async (req, res) => {
    try {
        const saleData = req.body;
        saleData._id = uuid();
        
        const newSale = await new Sale(saleData).save();
        res.status(201).json(newSale);
    } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR" });
    }
});

module.exports = router;