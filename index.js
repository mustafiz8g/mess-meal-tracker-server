const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5100

const app = express();
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nq2rk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let mealCollection;


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
     const db = client.db('mealTracker');
         mealCollection = db.collection('meals');

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");


// POST meal
app.post('/api/meals', async (req, res) => {
  const meal = req.body;
  const result = await mealCollection.insertOne(meal);
  res.send(result);
});

// GET meals for one user
app.get('/api/meals/my', async (req, res) => {
  const { uid } = req.query;
  const meals = await mealCollection.find({ uid }).toArray();
  res.send(meals);
});

// GET all meals
app.get('/api/meals/all', async (req, res) => {
  const meals = await mealCollection.find().toArray();
  res.send(meals);
});
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello from Mess_Meal Server..')
})
app.listen(port, () => console.log(`Server running on port ${port}`));