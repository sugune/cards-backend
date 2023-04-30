require('express-async-errors');
require('dotenv').config();

const express = require('express');
const app = express();

// modules
const connectDB = require('./db/connect');
const errorHandler = require('./middlewares/error-handler');
const notFound = require('./middlewares/not-found');
const cors = require('cors');

// security
app.use(cors())

// routers
const authRouter = require('./routers/auth');

// middleware
app.use(express.json())

// routes 
app.use('/api/v1/auth', authRouter);

app.use(errorHandler);
app.use(notFound);


const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`server is listening on port ${PORT}`))
  } catch (err) {
    console.log(err)
  }
}

start();
