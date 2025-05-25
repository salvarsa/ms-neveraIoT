const express = require('express')
const { connect } = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user.js');
const dotenv = require('dotenv')
dotenv.config()

const db = process.env.MONGODB || 'mongodb://root:12345abc@localhost:27017/futurapps?authSource=admin&directConnection=true'

const connectDb = async () => {
    try {
        await connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('DB CONNECTED..');
    } catch (error) {
        console.error('DB CONNECTION ERROR:', error);
    }
}

const app = express()
app.use(bodyParser.json())
app.use(express.static('src/public'))
app.use((req, res, next) => {
    if (req.url.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    if (req.url.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    next();
  });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.use('/api/v1/user', userRouter)

const PORT = process.env.PORT || 1716

app.listen(PORT, () => {
    connectDb();
    console.log(`neveraIoT ready at http://localhost:${PORT}`);
  })