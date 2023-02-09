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
        const bookingCollection = client.db('doctorsPortal').collection('bookings');

        app.get('/appointmentOptions', async (req, res) => {
            const date = req.query.date;
            const bookingQuery = { appointmentDate: date }
            const query = {};
            const options = await appointmentCollection.find(query).toArray();
            const alreadyBooked = await bookingCollection.find(bookingQuery).toArray();

            options.forEach(option => {
                const optionBooked = alreadyBooked.filter(book => book.treatment === option.name);
                const bookedSlots = optionBooked.map(book => book.slot);
                const remainingSlots = option.slots.filter(slot => !bookedSlots.includes(slot));
                option.slots = remainingSlots;
            })

            res.send(options);
        })

        app.get('/v2/appointmentOptions', async (req, res) => {
            const date = req.query.date;
            const options = await appointmentOptionCollection.aggregate([
                {
                    $lookup: {
                        from: 'bookings',
                        localField: 'name',
                        foreignField: 'treatment',
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$appointmentDate', date]
                                    }
                                }
                            }
                        ],
                        as: 'booked'
                    }
                },
                {
                    $project: {
                        name: 1,
                        slots: 1,
                        booked: {
                            $map: {
                                input: '$booked',
                                as: 'book',
                                in: '$$book.slot'
                            }
                        }
                    }
                },
                {
                    $project: {
                        name: 1,
                        slots: {
                            $setDifference: ['$slots', '$booked']
                        }
                    }
                }
            ]).toArray();
            res.send(options);
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const query = {
                appointmentDate: booking.appointmentDate,
                treatment: booking.treatment,
                email: booking.email
            }
            const alreadyBooked = await bookingCollection.find(query).toArray();

            if (alreadyBooked.length) {
                const message = `You have already booking on ${booking.appointmentDate}`
                return res.send({ aknowledged: false, message })
            }
            const result = await bookingCollection.insertOne(booking);
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