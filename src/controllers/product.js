const Product = require('../models/product.js');
const { v4: uuid } = require('uuid');

const getAllProducts = async (req, res) => {
    try {
        const products =  await Product.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR" });
    }
}

const createProduct = async (req, res) => {
    try {
        const productData = req.body
        productData._id = uuid()
        const product = await new Product(productData).save()
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR" });
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params._id
        const productData = req.body
        const product = await Product.findByIdAndUpdate(productId, productData, {new: true})

        if(!product){
            res.status(404).send('PRODUCT_NOT_FOUND')
        }

        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR" });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params._id
        const product = await Product.findByIdAndRemove(productId)

        if(!product){
            res.status(404).send('PRODUCT_NOT_FOUND')
        }

        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR" });
    }
}

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
}