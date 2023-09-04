const UserModel = require("../models/userModel");
const ProductModel = require('../models/productModel');
const handlePassword = require("../helpers/handlePassword");

var randtoken = require('rand-token')

var jwt = require("jsonwebtoken");
const upload = require("../helpers/uploadImage");

const privateKey = process.env.PRIVATE_KEY;

var refreshTokens = {};

const createUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const hashPassword = await handlePassword.cryptPassword(password);
    const user = await UserModel.create({
      ...rest,
      password: hashPassword,
    });
    if (!user) {
      return res.status(400).json('Create user fail')
    }
    res.status(201).json({
      message: "Create user success",
    });
  } catch (e) {
    res.status(500).json('Server error')
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.login({ username, password });
    console.log(user);
    const dataToken = {
      _id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      address: user.address,
      avatar: user.avatar
    };
    if (user) {
      var accessToken = jwt.sign(dataToken, privateKey);
      var refreshToken = randtoken.uid(256)
      refreshTokens[refreshToken] = username
      console.log('login success');
      res.status(201).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        msg: "User logged in successfully",
          username: user.username,
          user_id: user._id,
          email: user.email,
          phone: user.phone,
          address: user.address,
          avatar: user.avatar
      });
    }
  } catch (e) {
    res.status(500).json('Server error');
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findOne(
      { _id: req.user._id },
      "_id username email"
      );
      if (!user) {
        return res.status(400).json('User not found')
      }
      res.status(200).json(user);
    } catch (e) {
    res.status(500).json('Server error');
    }
};


const updateUser = async (req, res) => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      req.body,
      { new: true }
    );
    console.log(user);
    if(!user) {
      return res.status(400).json('User not found')
    }
    res.status(200).json({
      msg: "update user success",
      user: user
    });
  } catch (e) {
    res.status(500).json('Server error');
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const currentUser = await UserModel.findOne({ _id: userId });
    if (!currentUser) {
      return res.status(400).json("User not found");
    }

    const isPasswordMatch = await handlePassword.comparePassword(
      oldPassword,
      currentUser.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({
        msg: "Current password is incorrect",
      });
    }

    const newHashPassword = await handlePassword.cryptPassword(newPassword);


    await UserModel.updateOne({ _id: userId }, { password: newHashPassword });
    res.status(200).json({
      msg: "update password",

    });
  } catch (e) {
    console.log('err: ', e);
    res.status(500).json({
      msg: "Error updating password",
      error: e,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { username } = req.body;
    const users = await UserModel.findMany({ username: { $regex: username } });
    if (!users) {
      return res.status(400).json("User not found");
    }
    res.status(200).json({
      users,
    });
  } catch (e) {
    res.status(500).json({
      msg: "Error server",
      error: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.deleteOne({ _id: req.user._id });
    if (!user) {
      return res.status(400).json("User not found");
    }
    res.status(200).json("delete user success");
  } catch (e) {
    res.status(500).json({
      msg: "Error server",
      error: e,
    });
  }
};

const getListUsepopulate = async (req, res) => {
  try {
    console.log(req.user.username);
    const userList = await UserModel.getListUsepopulate({username: req.user.username})
    if (!userList) {
      return res(400).json("User not found")
    }
    res.status(202).json(userList)
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Error server get list",
      error: e,
    });
  }
}

const getOneProduct = async (req, res) => {
  try {
    console.log(req.body);
    const product = await ProductModel.findOne({_id: req.body._id})
    if (!product) {
      return res.status(400).json('product not found')
    }
    res.status(200).json(product)
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "There is some errr of getting product",
      error: e
    });
  }
}

const addToCart = async (req, res) => {
  try {
    const { _id, productname, price } = await ProductModel.findOne({_id: req.body._id})

    // Validate the data, ensuring all required fields are provided and have valid values

    // Retrieve the user document
    const user = await UserModel.findOne({ _id: req.user._id })

    // Check if the product already exists in the user's cart
    const existingProduct = user.cart.items.find((item) => { return new String(item._id).trim() == new String(_id).trim()});

    if (existingProduct) {
      // Update the quantity and sumPrice of the existing product
      existingProduct.quantity += 1;
      let sumPrice = price * existingProduct.quantity
      existingProduct.sumPrice = sumPrice;
    } else {
      // Create a new product object and push it to the user's cart
      const newProduct = { _id: _id, productname: productname, price: price, quantity: 1, sumPrice: price };
      user.cart.items.push(newProduct);
    }

    // Calculate the updated total price
    const total = user.cart.items.reduce((accumulator, item) => accumulator + item.sumPrice, 0);
    // });

    // Update the total price in the cart
    user.cart.total = total;

    // Save the updated user document
    await user.save();

    res.status(200).json({
      msg: "Product added to cart successfully",
      cart: user.cart,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Error server add to cart",
      error: e,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await UserModel.query(req.query);
    if (!result) {
      return res.status(404).json('user not found')
    }
    res.status(200).json(result)
  } catch (e) {
    res.status(500).json({
      msg: "Error server get users",
      error: e,
    });
  }
}

const uploadAvatar = async (req, res) => {
  console.log('res');
  upload(req, res, function (err) {
      if (err) {
          return res.status(400).json({
              success: false,
              error: err
          })
      }
      console.log('req.file: ', req.file);
      res.status(200).json({
          success: true,
          data: {...req.file}
      })
  })
}

const getProduct = async (req, res) => {
  try {
    console.log('get products');
    const products = await ProductModel.findMany(
      {},
      // 3,
      // 3,
    );
    console.log(products);
    if (!products || products.length == 0) {
      return res.status(400).json("Product not found");
    }

 
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json("Error server");
  }
};

module.exports = {
  createUser,
  getCurrentUser,
  updateUser,
  updatePassword,
  login,
  getUser,
  deleteUser,
  getListUsepopulate,
  getOneProduct,
  addToCart,
  getUsers,
  uploadAvatar,
  getProduct
};
