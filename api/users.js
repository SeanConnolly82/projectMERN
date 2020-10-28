const express = require("express");
const userRouter = express.Router();
const { check, validationResult } = require("express-validator/check");

// @ route:          GET api/users
// @ description:
userRouter.get("/", (req, res) => {
  res.send("User route");
});

userRouter.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    res.send("User route");
  }
);

module.exports = userRouter;
