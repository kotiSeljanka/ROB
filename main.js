/**
 * WHAT DO YOU NEED TO KNOW:
 * 
 * MAIN
 * Run this file with "npm run dev". This will open a blank 3D canvas to draw the points on.
 * 
 * If you did not make any changes to the file, the example data will be drawn.
 * Switch off the example data in the controller
 * 
 * If you want to draw the points in real time, you will need to also run the api.js file from .\javascript folder
 * "In real time" means that the drone is active and constantly sending the data to the API
 * 
 * API
 * To run the API, open a separate terminal and run "node .\javascript\api.js"
 * Yes, I could do this with script, but I do not know how :D
 * 
 * CONTROLLER
 * All the changes you need to do are located here
 * #1 Switch the example data or remove it completely 
 * #2 Toggle use of the API
 * #3 If API used, set delay between fetches in seconds
 * #4 Uncomment to see the lightsource and the grid
*/


// << CONTROLLER: all the changes you need to do
// #1
// << Comment out if no pre-made data
fetchData('./json/dataWork.json');

// #2
// << Set to false if not using the API
const USEFETCH = true;
// #3
// << Set the delay between fetches, if using API
const TIMEDELAY = 3;

// #4
// << HELPERS
// << Removed for presentation. Uncomment for better understanding
/* const lightHelper = new THREE.PointLightHelper(pointLigth);
const gridHelper = new THREE.GridHelper( 200, 50 );
scene.add( lightHelper, gridHelper ); */

// <<



import './css/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// READER
/**
 * Read pre-made poind cloud data.
 * @param {String} fileName Relative path to the file
*/
function fetchData(fileName) {
  fetch(fileName)
    .then( (res) => res.json())
    .then( (data) => {
      for (let i = 0; i < data.length; i++) {
        addPoint(data[i]['x'],data[i]['y'],data[i]['z'])
      }
    }
  );
}


/**
 * Fetch point from API, draw it to the canvas
 */
function fetchPoint() {
  fetch('http://localhost:3000/point')
    .then( (res) => res.json() )
    .then( (data) => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        point = data[i];
        addPoint(point['x'], point['y'], point['z'])
      }
    })
    .catch( (err) => {
      console.log("No points, probably");
    })
}


// SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


// RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
// Set camera position
camera.position.setZ(50);
camera.position.setY(30);


// MATERIAL
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 } );

// POINT
// Multiplier value for float values coming from data: more understandable scene
const MULTIPLIER = 10;
/**
 * Draws a point to the canvas. 
 * Note: altered position data during dev for correct functioning. Might be broken with new data. 
 * @param {Float} x x-axis position
 * @param {Float} y !!! negative z-axis position: negative to flip the dimension to the other side
 * @param {Float} z !!! y-axis position: no clue why this is, yet
 */
function addPoint(x, y, z) {
  const pointGeometry = new THREE.SphereGeometry( 0.3 );
  const point = new THREE.Mesh( pointGeometry, material );
  point.position.set(x*MULTIPLIER, -z*MULTIPLIER+30, y*MULTIPLIER);
  scene.add(point);  
}


// BOX
/**
 * Draws a big box to the canvas.
 * @param {Float} x x-axis position
 * @param {Float} y y-axis position
 * @param {Float} z z-axis position
 */
function addBox(x, y, z) {
  const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
  const box = new THREE.Mesh( boxGeometry, material );
  box.position.set(x, y, z);
  scene.add(box);
}


// LIGHT
const pointLigth = new THREE.PointLight(0xffffff);
const ambientLight = new THREE.AmbientLight(0xffffff);
pointLigth.position.set( 5, 5, 5 );
scene.add(pointLigth, ambientLight);


// BACKGROUND
const skyTexture = new THREE.TextureLoader().load('./img/sky.jpg');
scene.background = skyTexture;

// ANIMATION
const controls = new OrbitControls( camera, renderer.domElement ); 
controls.autoRotate = true;


// CLOCK
const clock = new THREE.Clock();


// MAIN FUNCTION
/**
 * Helper function
 * @param {Integer} timeDelay Time between fetches
 */
function timedFetch(timeDelay) {
  if (clock.getElapsedTime() > timeDelay) {
    clock.start();
    fetchPoint();
  }
}

/**
 * Main function of the file.
 */
function animate() {
  requestAnimationFrame( animate );
  // Allow to control the view
  controls.update();
  // Fetch a point after some delay
  if (USEFETCH) { timedFetch(TIMEDELAY); }
  renderer.render( scene, camera );
}

animate();