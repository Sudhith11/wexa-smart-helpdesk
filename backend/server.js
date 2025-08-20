require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/database');

const app = express();
connectDB();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/healthz', (req,res)=> res.json({status:'OK'}));

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/kb', require('./src/routes/kb'));
app.use('/api/tickets', require('./src/routes/tickets'));
app.use('/api/agent', require('./src/routes/agent'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> console.log('API on', PORT));

module.exports = app;
