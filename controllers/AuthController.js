const { User, Profile } = require("../models");
const jwt = require("jsonwebtoken");

// Initialize signToken
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Initialize token in to cookie
const setTokenCookie = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOption);
  res.status(statusCode).json({
    status: "success",
    data: {
      user,
    },
  });
};

const registerUser = async (req, res) => {
  try {
    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Password not match",
        error: ["Password not match"],
      });
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    setTokenCookie(newUser, 201, res);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "fail",
      message: "Register failed",
      error: error.errors.map((err) => err.message),
    });
  }
};

const loginUser = async (req, res) => {
  //  validation form
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      status: "fail",
      message: "Email and Password cannot be empty",
      error: ["Email and Password cannot be empty"],
    });
  }
  // Check email and password in DB
  const userData = await User.findOne({ where: { email: req.body.email } });

  if (
    !userData ||
    !(await userData.CorrectPassword(req.body.password, userData.password))
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Incorrect email or password",
      error: ["Incorrect email or password"],
    });
  }
  // Make Token for user
  setTokenCookie(userData, 200, res);
};

const logoutUSer = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({
    status: "success",
    message: "Logout success"
  })
}

const getMyUser = async (req, res) => {
  const currentUser = await User.findOne({
    where: { id: req.User.id },
    include: [
      {
        model: Profile,
        attributes: { exclude:  [
          "createdAt", "updatedAt", "user_id"
        ]}
      }
    ],
    attributes: { exclude:  [
      "createdAt", "updatedAt", "password"
    ]}
  })
  if(currentUser){
    return res.status(200).json(
      {
        message: "Success get user",
       data: currentUser
      }
    )
  }
  return res.status(404).json({
    status: "Fail",
    message: " User Not Found"
  })
}

module.exports = {
  registerUser,
  loginUser,
  logoutUSer,
  getMyUser
};
