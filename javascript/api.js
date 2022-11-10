import express from 'express';
import bodyParser from 'body-parser'; 
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    if (newPoints.length === 0) {
      res.sendStatus(418);
      console.log("Points empty")
    } else {
      res.json(newPoints);
      newPoints = [];  
      console.log("Showing all points");
    }
})
// Add an xyz-point to the storage
app.post("/addPoint", (req, res) => {
  const data = req.body;
  console.log( data );
  if(data.length == undefined || data.length === 0 ){
    res.sendStatus(416)
    console.log("someone tried to do invalid post request 😏")
  }
  else{
    for (let i = 0; i < data.length; i++) {
      newPoints.push(data[i]);
    }
    res.sendStatus(200)
    console.log( `added ${data.length} points via post request`)
  }
})
app.post("/extAddPoint", (req, res) => {
  const data = req.body;
  console.log( data );
  if(data == undefined ){
    res.sendStatus(416)
    console.log("someone tried to do invalid post request 😏")
  }
  else{
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const innerArray = data[keys[i]]
      for (let y = 0; y < innerArray.length; y++) {
        const newObj = {
          'x': innerArray[y][0],
          'y': innerArray[y][1],
          'z': innerArray[y][2]
        };
        newPoints.push(newObj);
        console.log(newObj);
      }
    }
    res.sendStatus(200)
    console.log( `added some points via post request`)
  }

})

app.listen(PORT);
console.log(`Listening to port ${PORT}`)