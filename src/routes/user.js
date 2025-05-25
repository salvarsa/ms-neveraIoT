const express = require('express')
const userRouter = express.Router()
const {
    getAllUsers,
    getUserById,
    getUserByCardCode,
    createUser,
    updateUser,
    deleteUser,
    updateLastAccess
} = require('../controllers/user.js')

userRouter.use(express.json())

userRouter.route('/').get(getAllUsers)
userRouter.route('/id/:id').get(getUserById);
userRouter.route('/cardCode/:cardCode').get(getUserByCardCode);
userRouter.route('/last-access')
    .get((req, res) => {
        const data = req.app.locals.lastAccessData || { userId: null, timestamp: 0 };
        const now = Date.now();
        
        // Datos expiran después de 2 segundos
        if (now - data.timestamp > 2000) {
            return res.status(200).json({ userId: null, timestamp: now });
        }
        
        res.status(200).json(data);
    })
    .post(updateLastAccess);
userRouter.route('/clear-access').post((req, res) => {
    req.app.locals.lastAccessData = {
        userId: null,
        timestamp: null,
        isActive: false
    };
    res.status(200).json({ message: "ACCESS_CLEARED" });
});
userRouter.route('/create').post(createUser)
userRouter.route('/update').put(updateUser)
userRouter.route('/delete').delete(deleteUser)

module.exports = userRouter