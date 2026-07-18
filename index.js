require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

// instance
const app = express();
const port = process.env.PORT || 5000;

// middlewars
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.89rnkti.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('You successfully connected to MongoDB!');
    // ==============================================================
    const database = client.db('soloMatrixDB');
    const jobsCollection = database.collection('jobs');
    // =============== JOBS COLLECTION    ================
    app.get('/jobs', async (req, res) => {
      const result = await jobsCollection.find().toArray();
      res.send(result);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('server is running!');
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
