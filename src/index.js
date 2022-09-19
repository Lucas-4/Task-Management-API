const express = require('express');

const User = require('./models/user.js');
const Task = require('./models/task.js');

const userRouter = require('./router/user.js');
const taskRouter = require('./router/task.js');

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
})

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log("Server started on port " + port);
})