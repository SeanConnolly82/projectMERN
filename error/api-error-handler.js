const ApiError = require("./ApiError");

function apiErrorHandler(err, req, res, next) {
    console.log(err);

    if (err instanceof ApiError) {
        res.status(err.status).json({ errors: [{ msg: err.message }] });
        return;
    }

    res.status(500).send('Server error');
};

module.exports = apiErrorHandler;