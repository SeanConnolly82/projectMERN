const express = require("express");

const userRouter = require("./api/users");
const authRouter = require("./api/auth");
const connectDB = require("./config/db");

const app = express();

// Connect to Mongo
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
