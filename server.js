const express = require('express');

const connectDB = require('./config/db');
const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const profileRouter = require('./routes/profile');

const app = express();

// Connect to Mongo
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/profile', profileRouter);

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
