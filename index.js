const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000 || process.env.PORT;

// middle wire

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Portal is running')
})
app.listen(port, () => console.log('Server is running at', port)
)