const userRouter = require("express").Router();
const userController = require("../Controller/user");
const {authenticateUser} = require("../Middlewares/authMiddleware")
const {validate} = require("../Middlewares/validate")
const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  userIdValidation
} = require('../Utilities/validations');

userRouter.post("/register", validate(registerValidation, 'body'),userController.registerUser);
userRouter.post("/login", validate(loginValidation, 'body'), userController.loginUser);
userRouter.get("/users-details", authenticateUser,userController.fetchUsers);
userRouter.get("/user-profile/", authenticateUser,userController.fetchUser);
userRouter.patch("/update-user/:id",validate(userIdValidation, 'params'),validate(updateProfileValidation, 'body'),authenticateUser, userController.updateUser);
userRouter.delete("/remove-user/:id", validate(userIdValidation, 'params'), userController.deleteUser);
// userRouter.patch("/reset-password",userController.resetPassword);
// userRouter.post("/logout",userController.logOut);
  



module.exports = {userRouter};