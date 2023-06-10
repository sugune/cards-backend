require('express-async-errors');
require('dotenv').config();

const express = require('express');
const app = express();

// imports
const connectDB = require('./db/connect');
const errorHandler = require('./middlewares/error-handler');
const notFound = require('./middlewares/not-found');
const cors = require('cors');
const authenticate = require('./middlewares/authentication');

// security
app.use(cors())

// routers
const authRouter = require('./routers/auth');
const deckRouter = require('./routers/deck');
const cardRouter = require('./routers/card');

// middleware
app.use(express.json())

// routes 
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/deck', authenticate, deckRouter);
app.use('/api/v1/card', authenticate, cardRouter);

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
