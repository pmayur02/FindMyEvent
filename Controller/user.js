const userService = require("../Services/user");
const {sendSuccess, sendError} = require("../Utilities/utils")

module.exports.registerUser= async (req, res, next) => {
  try {

    const result = await userService.register(req.body);
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('Register error:', error.message);
    next(error);
  }
};

module.exports.loginUser= async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('Login error:', error.message);
    next(error);
  }
};

module.exports.fetchUser= async (req, res, next) => {
  try {

    const userId = req.user.id;
    const result = await userService.fetchUser(userId);
    
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('user fetch error:', error.message);
    next(error);
  }
};

module.exports.fetchUsers= async (req, res, next) => {
  try {

    const result = await userService.fetchUsers(req);
    
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('users fetch error:', error.message);
    next(error);
  }
};

module.exports.updateUser= async (req, res, next) => {
  try {

    const userId = req.params.id;
    const result = await userService.updateUser(userId,req.body);
    
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('users update error:', error.message);
    next(error);
  }
};

module.exports.deleteUser= async (req, res, next) => {
  try {

    const userId = req.params.id;
    const result = await userService.deleteUser(userId);
    
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('users delete error:', error.message);
    next(error);
  }
};

module.exports.resetPassword= async (req, res, next) => {
  try {

    const result = await userService.resetPassword(req.body);
    
    res.status(200).json({
      success: true,
      message: 'password reset successfully',
      data: result
    });

  } catch (error) {
    console.error('password reset error:', error.message);
    next(error);
  }
};

module.exports.logOut= async (req, res, next) => {
  try {

    const result = await userService.logOut(req.body);
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      data: result
    });

  } catch (error) {
    console.error('Logout error:', error.message);
    next(error);
  }
};