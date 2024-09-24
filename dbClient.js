const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3003;

// MongoDB connection string
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.use(express.json());

// Connect to MongoDB
client
  .connect()
  .then(() => {
    const db = client.db("Canary");
    const collection = db.collection("Items");

    // HTTP GET endpoint
    app.get("/", async (req, res) => {
      const data = await collection.find().toArray();
      res.json(data);
    });

    // HTTP POST endpoint
    app.post("/data", async (req, res) => {
      const newData = req.body;
      await collection.insertOne(newData);
      res.status(201).json(newData);
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
