const cors = require('cors');
const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const sectionRouter = require('./routers/section');

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(sectionRouter);

app.listen(port, () => {
  console.log(`Server is setup in port ${port}`);
});
