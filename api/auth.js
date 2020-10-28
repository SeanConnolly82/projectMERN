const express = require('express');
const authRouter = express.Router();

// @ route:          GET api/auth
// @ description:       
authRouter.get('/', (req, res) => {
    res.send('Auth route');
});

module.exports = authRouter;
