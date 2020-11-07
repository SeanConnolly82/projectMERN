const express = require('express');

const connectDB = require('./config/db');
const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const profileRouter = require('./routes/profile');

const errorHandler = require('./error/api-error-handler');

const app = express();

// Connect to Mongo
connectDB();
// This limit sets the filesize for uploading!!!
app.use(express.json({ limit: 11000000 }));
// Init Middleware
app.use(express.json({ extended: false }));
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/profile', profileRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
