import * as fs from 'fs';
const dataJSON = JSON.parse(fs.readFileSync('json/data2.json'));

let arrayFinal = []
dataJSON.forEach( (obj) => {
    arrayFinal.push({
        'x': obj['x'],
        'y': obj['y'],
        'z': obj['z']
    })
})

fs.writeFileSync('json/dataWork2.json', JSON.stringify(arrayFinal));