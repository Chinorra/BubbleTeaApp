const express = require("express");
const userRouter = require("./user");
const productRouter = require("./product");
const { userController, productController } = require("../controllers");
const { authMiddleware } = require("../middleware/authMiddleware");
const { checkAdminMiddleware } = require("../middleware/checkAdminMiddleware");

const router = express.Router();

router.use("/user", authMiddleware, userRouter);
router.use("/product", authMiddleware, checkAdminMiddleware, productRouter);

router.get("/user/product", productController.getProduct);

router.post("/login", userController.login);
router.post("/", userController.createUser);

module.exports = router;
