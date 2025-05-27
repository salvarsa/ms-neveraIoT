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
        
        // IMPORTANTE: Marcar la compra como completada en el estado global
        if (req.app.locals.lastAccessData && req.app.locals.lastAccessData.userId === saleData.userId) {
            req.app.locals.lastAccessData.purchaseCompleted = true;
            req.app.locals.lastAccessData.timestamp = Date.now();
            console.log('Compra completada para usuario:', saleData.userId);
        }
        
        res.status(201).json(newSale);
    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(500).json({ message: "SERVER_ERROR" });
    }
});

module.exports = router;