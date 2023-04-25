const fs = require('fs');

const fileContent = fs.readFileSync('sentences.txt', 'utf-8');

const arrays = fileContent.split('][').map(arr => {
    return arr.split(',');
});

// Concatenate the arrays
const concatenatedArray = arrays.reduce((acc, curr) => acc.concat(curr), []);
concatenatedArray.forEach(element => {
    console.log(element.replace(/\n/g, ''))
})
