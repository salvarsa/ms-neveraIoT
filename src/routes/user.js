const express = require('express')
const userRouter = express.Router()
const {
    getAllUsers,
    getUserById,
    getUserByCardCode,
    createUser,
    updateUser,
    deleteUser,
    updateLastAccess,
    completePurchase
} = require('../controllers/user.js')

userRouter.use(express.json())

userRouter.route('/').get(getAllUsers)
userRouter.route('/id/:id').get(getUserById);
userRouter.route('/cardCode/:cardCode').get(getUserByCardCode);
userRouter.route('/last-access')
    .get((req, res) => {
        const data = req.app.locals.lastAccessData || { 
            userId: null, 
            timestamp: 0, 
            isActive: false, 
            purchaseCompleted: false 
        };
        const now = Date.now();
        
        // Si no hay datos o son muy antiguos (más de 30 segundos)
        if (!data.userId || now - data.timestamp > 30000) {
            return res.status(200).json({ 
                userId: null, 
                timestamp: now, 
                isActive: false, 
                purchaseCompleted: false 
            });
        }
        
        if (data.purchaseCompleted) {
            return res.status(200).json({
                userId: data.userId,
                timestamp: data.timestamp,
                isActive: false,
                purchaseCompleted: true
            });
        }
        
        res.status(200).json(data);
    })
    .post(updateLastAccess);


userRouter.route('/complete-purchase').post(completePurchase);

userRouter.route('/clear-access').post((req, res) => {
    req.app.locals.lastAccessData = {
        userId: null,
        timestamp: null,
        isActive: false,
        purchaseCompleted: false
    };
    res.status(200).json({ message: "ACCESS_CLEARED" });
});

userRouter.route('/create').post(createUser)
userRouter.route('/update').put(updateUser)
userRouter.route('/delete').delete(deleteUser)

module.exports = userRouter