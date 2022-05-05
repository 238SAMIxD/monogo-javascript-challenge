const fetch = require('node-fetch');

const buildingNumber = 14;
const companyName = "Monogo";

fetch(`https://raw.githubusercontent.com/238SAMIxD/monogo-javascript-challenge/main/data.json`) // original url: https://www.monogo.pl/competition/input.txt
    .then( response => response.json() )
    .then( json => {
        const grouped = group(json);
        const filtered = filter(json.selectedFilters, grouped);
        const multiplied = multiply(filtered);
        const additionArray = toArray(multiplied);
        const result = finalResult(multiplied, additionArray.reduce((previous, value, index) => {return value == buildingNumber ? index : previous}), companyName.length);

        console.log(`The final result is: ${result}`);
    });


function group( json ) {
    const data = [];

    json.products.forEach(element => {
        element.id = parseInt(element.id);

        data.push(element);
    });

    json.colors.forEach(element => {
        const newData = data.find(object => object.id == element.id);

        element.id = parseInt(element.id);

        element.color = element.value;
        delete element.value;

        data[data.indexOf(newData)] = {
            ...newData,
            ...element
        }
    });

    json.sizes.forEach(element => {
        const newData = data.find(object => object.id == element.id);
        
        element.id = parseInt(element.id);

        element.size = element.value;
        delete element.value;

        data[data.indexOf(newData)] = {
            ...newData,
            ...element
        }
    });

    return data;
}

function filter( filters, data ) {
    return data.filter(element => { return element.price > 200 && filters.colors.includes(element.color) && filters.sizes.includes(element.size) });
}

function multiply( data ) {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    data.forEach(element => {
        if(element.price < min) min = element.price;
        if(element.price > max) max = element.price;
    });

    return Math.round(min*max);
}

function toArray( number ) {
    const toString = number.toString();
    const makeArray = toString.split("");
    const toDigits = makeArray.map(digit => parseInt(digit));
    const result = [];

    toDigits.forEach((digit, index, arr) => {
        if(index % 2 == 1) return;
        
        result.push(digit + arr[index + 1] || 0);
    });

    return result;
}

function finalResult( a, b, c ) {
    return a*b*c;
}