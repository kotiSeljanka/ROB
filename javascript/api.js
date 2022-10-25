import express from 'express';
import cors from 'cors';

const PORT = 3000
// Main storage for the points
let newPoints = []

const app = express();
// Avoiding CORS
app.use(
    cors({
        origin: "*",
    })
)
// Fetch one point and remove it from the storage
app.get("/point", (req, res) => {
  const resPoint = newPoints.shift();
  if (resPoint == undefined) {
    res.sendStatus(204);
    console.log("Fetch failed")
  } else {
    res.json(resPoint);
    console.log("Fetch succesfull")
  }
})
// Add a random point to the storage
app.get("/addRandom", (req, res) => {
    res.sendStatus(200);
    newPoints.push({
        'x': Math.floor(Math.random() * 10),
        'y': Math.floor(Math.random() * 10),
        'z': Math.floor(Math.random() * 10)
    });
    console.log("Point added")
})
// Get all the points currently saved
app.get("/all", (req, res) => {
    res.json({
        'points': newPoints
    })
    console.log("Showing points")
})

app.listen(PORT);