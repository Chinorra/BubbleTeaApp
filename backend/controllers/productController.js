const ProductModel = require("../models/productModel");

const createProduct = async (req, res) => {
  try {
    const product = await ProductModel.create(req.body);
    console.log(product);
    if (!product) {
      return res.status(400).json("Product invalid");
    }
    res.status(200).json("Create product(s) success");
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "There is some errr...",
      error: e
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { _id, productname, price } = req.body;
    const product = await ProductModel.findOneAndUpdate(
      { _id: _id },
      { productname: productname, price: price },
      { new: true }
    );
    if (!product) {
      return res.status(400).json("Product not found");
    }
    res.status(200).json("update product success");
  } catch (e) {
    res.status(500).json("Error server");
  }
};

const deleteProduct = async (req, res)=> {
    try {
        const product = await ProductModel.deleteOne({_id: req.body._id});
        if(product) {
            return res.status(400).json('Prduct not found')
        }
        res.status(200).json('Delete product success')
    } catch (e) {
        res.status(500).json("Error server");
      }
}

const queryProducts = async (req, res) => {
  try {
    const products = await ProductModel.query(req.query);
    if (!products) {
      return res.status(404).json('products not found')
    }
    res.status(200).json(products)
  } catch (e) {
    res.status(500).json("Error server to query products");
  }
}



module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  queryProducts
};
