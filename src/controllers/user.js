const User = require('../models/user.js')
const { v4: uuid } = require('uuid')

const getAllUsers = async (req, res) => {
    try {
        const user = await User.find()
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR" });
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.find({ id: userId })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR" });
    }
}

const updateLastAccess = async (req, res) => {
    try {
        req.app.locals.lastAccessData = {
            userId: req.body.userId,
            timestamp: Date.now(),
            isActive: true ,
            purchaseCompleted: false 
        };
        res.status(200).json({ message: "UPDATE_SUCCESS" });
    } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR" });
    }
};

const clearAccess = async (req, res) => {
    try {
        if (req.app.locals.lastAccessData) {
            req.app.locals.lastAccessData.isActive = false;
            req.app.locals.lastAccessData.purchaseCompleted = false;
        }
        res.status(200).json({ message: "ACCESS_CLEARED" });
    } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR" });
    }
};

const completePurchase = async (req, res) => {
    try {
        if (req.app.locals.lastAccessData) {
            req.app.locals.lastAccessData.purchaseCompleted = true;
            req.app.locals.lastAccessData.timestamp = Date.now(); // Actualizar timestamp
        }
        res.status(200).json({ message: "PURCHASE_COMPLETED" });
    } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR" });
    }
};

const getUserByCardCode = async (req, res) => {
    try {
        const userCardCode = req.params.cardCode
        const user = await User.find({cardCode: userCardCode })

        if(user.length === 0) {
            return res.status(404).json({ message: "USER_NOT_FOUND" });
        }

        res.status(200).json(user)  
    } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR" });
    }
}

const createUser = async (req, res) => {
    try {
        const userData = req.body
        userData._id = uuid()
        const user = await new User(userData).save()
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR" });
    }
}

const updateUser = async (req, res) => {
    try {
        const updateUserId = req.params._id
        const userData = req.body
        const user = await User.findByIdAndUpdate(updateUserId, userData, {new: true})

        if(!user){
            res.status(404).send('USER_NOT_FOUND')
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR" });
    }
}

const deleteUser = async (req, res) => {
    try {
        const getId = req.params._id
        const user = await User.findByIdAndRemove(getId)

        if(!user){
            res.status(404).send('USER_NOT_FOUND')
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR" });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByCardCode,
    createUser,
    updateUser,
    deleteUser,
    clearAccess,
    updateLastAccess,
    completePurchase
}