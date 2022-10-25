import * as fs from 'fs';
const dataJSON = JSON.parse(fs.readFileSync('json/data.json'));

let arrayFinal = []
dataJSON.forEach( (obj) => {
    const points = obj["points"];
    points.forEach( (triple) => {
        arrayFinal.push({
            'x': triple[0],
            'y': triple[1],
            'z': triple[2]
        })
    })
})

fs.writeFileSync('json/dataWork.json', JSON.stringify(arrayFinal));