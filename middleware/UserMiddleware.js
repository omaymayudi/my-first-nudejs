const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");

const authMiddleware = async (req, res, next) => {
  // Chack Token
  let token;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];
  // }

  token = req.cookies.jwt

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized",
    });
  }

  //   Verify Token
  let decoded;
  try {
    decoded = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(
      res.status(401).json({
        status: "fail",
        message: "Unauthorized, Token Not Found",
        error,
      })
    );
  }

  //   Get data user from token
  const currentUser = await User.findByPk(decoded.id);
  //   console.log(currentUser);
  //   if user not found or deleted
  if (!currentUser) {
    return next(
      res.status(401).json({
        status: "fail",
        message: "Unauthorized, User Not Found",
      })
    );
  }

  req.User = currentUser;
  next();
  
};

const permissionUser = (...roles) => {
  return async (req, res, next) => {
    const rolesData = await Role.findByPk(req.User.role_id);
    const roleName = rolesData.name;
    if (!roles.includes(roleName)) {
      return next(
        res.status(403).json({
          status: "fail",
          message: "Unauthorized",
          error: "Don`t have permission",
        })
      );
    }
    next();
  };
};


module.exports = { authMiddleware, permissionUser };
