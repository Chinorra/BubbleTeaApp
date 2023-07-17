const Product = require('../entities/productSchema');
const BaseModel = require('./baseModel');

class ProductModel extends BaseModel {
    async query(query) {
        const { productname, limit = 10, skip = 0 } = query;
        const regex = new RegExp(productname, "i");
    
        const data = await Product.find({ productname: { $regex: regex } })
          .skip(Number(skip))
          .limit(Number(limit))
          .sort({ productname: 1 });
    
        return data;
      }
}

module.exports = new ProductModel(Product);