const checkAdminMiddleware = (req, res, next) => {
  try {
    const isAdmin = req.user.role == "admin";
    console.log(isAdmin);
    
    if (!isAdmin) {
      return res.status(400).json("you are not admin");
    }

    next();
  } catch (e) {
    res.status(500).json("Error server", e);
  }
};

module.exports = { checkAdminMiddleware };
