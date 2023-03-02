const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken')
const authCheck = require('../../middleware/check-auth')
const productTable = require('../models/addProduct');
const registerTable = require('../models/adminRegister');
const loginTable = require('../models/loginTable');
const cartTable = require('../models/addCart');
const checkAuth = require('../../middleware/check-auth');
const adminRouter = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, ('../add_cart/public/images'))
    },
    filename: function (req, file, cb) {
        cb(null, req.body.name);
    }
});

const upload = multer({ storage: storage });

adminRouter.post('/upload', upload.single('file'), function (req, res) {

    res.status(200).json({
        message: "image uploaded"
    })

})


adminRouter.post('/add-product', authCheck, async (req, res) => {

    const { productName, productDetails, productPrice, totalStocks, profileImg, } = req.body
    try {
        const products = await productTable.create({
            productName,
            productDetails,
            productPrice,
            profileImg,
            totalStocks
        })
        console.log(products)
        if (!products) {
            res.status(400).json({
                message: "data is not submitted"
            })

        }
        else {
            res.status(200).json({
                data: res.data,
                message: "successful"
            })
        }
    } catch (error) {
        return res.status(404).json({ ERROR: error })
    }

})


adminRouter.post('/login', async (req, res) => {

    const { mobileNumber, password } = req.body

    const loginDetails = await loginTable.findOne({ mobileNumber })

    if (!loginDetails) {
        res.status(400).json({
            message: "mobile  number doesn't exists"
        })
    } else {
        const hashed = await bcrypt.compare(password, loginDetails.password)
        if (hashed == true) {
            const token = jwt.sign({ loginId: loginDetails._id }, 'secret_007', { expiresIn: "1h" })

            return res.status(200).json({
                message: "Login successful",
                success: true,
                error: false,
                token: token,
            })
        } else {
            res.status(404).json({
                message: "password error",
                success: false,
                error: true
            })
        }
    }
})


adminRouter.post('/register', async (req, res) => {
    const {
        fullName, mobileNumber, password
    } = req.body
    try {
        const hashed = await bcrypt.hash(password, 10)

        if (!hashed) {
            return res.status(404).json({ message: "password hashing error" })
        } else {
            const oldUser = await loginTable.findOne({ mobileNumber })
            if (oldUser) {
                return res.status(404).json({ message: "user already exists" })
            } else {
                const login = await loginTable.create({ mobileNumber, password: hashed })
                if (!login) {
                    return res.status(404).json({ message: "something went wrong" })
                } else {

                    const register = await registerTable.create({
                        loginId: login._id,
                        fullName, mobileNumber, password
                    })
                    if (!register) {
                        return res.status(404).json({
                            message: "something went wrong"
                        })
                    }
                    else {
                        return res.status(200).json({
                            message: " register data added successfully"
                        })
                    }

                }
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(404).json({
            ERROR: error
        })
    }

})




adminRouter.get('/product-view', authCheck, async (req, res) => {
    const productDetails = await productTable.find()
    try {
        if (!productDetails) {
            res.status(404).json({ message: "data is not occured" })
        } else {
            return res.status(200).json({
                message: "successful",
                data: productDetails,
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(404).json({ ERROR: error })
    }

})

adminRouter.post('/add-cart', authCheck, async (req, res) => {
    const { id } = req.body
    try {
        const product = await productTable.findById({ _id: id });
        let newStock = product.totalStocks - 1;
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        else {
            const cartdata = await cartTable.create({
                cartId: id,
            })
            const stockupdate = await productTable.findByIdAndUpdate({ _id: id }, { totalStocks: newStock })

            if (!cartdata) {
                res.status(400).json({ message: 'add to cart error' });
            }
            else {
                if (!stockupdate) {
                    res.status(400).json({ message: 'stock update error' });
                }
                else {
                    res.status(200).json({ message: 'stock update successfull' });
                }
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

adminRouter.get('/cart-view', authCheck, async (req, res) => {
    try {
        const view = await cartTable.aggregate([
            {
                '$lookup': {
                    'from': 'producttables',
                    'localField': 'cartId',
                    'foreignField': '_id',
                    'as': 'result'
                }
            },
            {
                '$unwind': '$result'
            },
            {
                '$group': {
                    '_id': '$_id',
                    'productName': { '$first': '$result.productName' },
                    'productDetails': { '$first': '$result.productDetails' },
                    'productPrice': { '$first': '$result.productPrice' },
                    'totalStocks': { '$first': '$result.totalStocks' },
                }
            }
        ])
        if (view) {
            return res.status(200).json({
                data: view
            })
        }
        console.log(view);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }

})

adminRouter.post('/cart-delete', authCheck, async (req, res) => {
    const { id,productName } = req.body
    try {
        const cartItem = await cartTable.findByIdAndDelete({ _id: id })
        
        const product = await productTable.findOne({ productName: productName });
        console.log("value",product);
        let newStock = Math.floor(product.totalStocks)+1;
        console.log(newStock);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        else {
            const stockupdate = await productTable.findByIdAndUpdate({_id:product.id }, { totalStocks: newStock })
            console.log(stockupdate);
            if (!stockupdate) {
                res.status(400).json({ message: 'stock update error' });
            }
            else {
                res.status(200).json({ message: 'stock update successfull' });
            }
        }
    }catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
    }
})




module.exports = adminRouter