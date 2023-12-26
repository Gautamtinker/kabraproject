const sendToken = (user, statuscode, res) => {
  const token = user.getJWT();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };

  res.status(statuscode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

export default sendToken;
