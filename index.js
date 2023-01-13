const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000 || process.env.PORT;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// middle wire

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j88am2v.mongodb.net/?retryWrites=true&w=majority`;




app.get('/', (req, res) => {
    res.send('Portal is running')
})
app.listen(port, () => console.log('Server is running at', port)
)