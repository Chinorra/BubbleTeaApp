const User = require("../entities/userSchema");
const BaseModel = require("./baseModel");
const handlePassword = require("../helpers/handlePassword");

class UserModel extends BaseModel {
  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    const isPasswordMatch = await handlePassword.comparePassword(
      password,
      user.password
    );
    if (isPasswordMatch) {
      return user;
    } else {
      throw new Error("Invalid passowrd");
    }
  }

  async getListUsepopulate({ username }) {
    const userList = await User.findOne({ username }).populate({
      path: "products",
      select: "productname price",
    });
    if (!userList) throw new Error("User not found");
    return userList;
  }

  async query(query) {
    const { username, limit = 10, skip = 0 } = query;
    const regex = new RegExp(username, "i");

    const data = await Product.find({ username: { $regex: regex } })
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ username: 1 });

    return data;
  }
}

module.exports = new UserModel(User);
