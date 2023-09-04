const express = require("express");
const userRouter = require("./user");
const productRouter = require("./product");
const { userController } = require("../controllers");
const { authMiddleware } = require("../middleware/authMiddleware");
const { checkAdminMiddleware } = require("../middleware/checkAdminMiddleware");

const router = express.Router();

router.use("/user", authMiddleware, userRouter);
router.use("/product", authMiddleware, checkAdminMiddleware, productRouter);


router.post("/login", userController.login);
router.post("/register", userController.createUser);

module.exports = router;
