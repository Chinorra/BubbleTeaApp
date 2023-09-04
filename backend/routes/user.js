const express = require('express');
const { userController } = require('../controllers/index');
const { middlewareValidate, updateUserSchema, updatePasswordSchema } = require('../middleware/validateMiddleware');

const userRouter = express.Router();

userRouter.post('/add', userController.addToCart);
userRouter.post('/upload/:user_id', userController.uploadAvatar)
userRouter.get('/current',userController.getCurrentUser);
userRouter.get('/name',userController.getUser);
userRouter.get('/list',userController.getListUsepopulate);
userRouter.get('/users',userController.getUsers);
userRouter.get('/product', userController.getProduct);
// userRouter.get('/product',userController.getOneProduct);
userRouter.delete('/delete', userController.deleteUser);
userRouter.patch('/update',
middlewareValidate(updateUserSchema),
 userController.updateUser);
userRouter.patch('/password',
middlewareValidate(updatePasswordSchema),
 userController.updatePassword);

module.exports = userRouter;