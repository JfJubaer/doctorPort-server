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
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const appointmentCollection = client.db('doctorsPortal').collection('appointmentOptions');

        app.get('/appointmentOptions', async (req, res) => {
            const query = {};
            const result = await appointmentCollection.find(query).toArray();
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.log);


app.get('/', (req, res) => {
    res.send('Portal is running')
})
app.listen(port, () => console.log('Server is running at', port)
)