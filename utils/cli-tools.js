const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const N = "\n";

function BadInputException(message) {
    this.message = message;
    this.name = "Bad Input Exception";
}

function RandomException(message) {
    this.message = message;
    this.name = "Random Unforseen Exception";
}

function ProdticketException(message) {
    this.message = message;
    this.name = "Malformed Prodticket HTML"
}

function getInputDirectory () {
    // process.cwd() returns the directory from which you ran Node process 
    var currentDir = process.cwd();
    return path.join(currentDir, 'input');
} 

function getOutputDirectory () {
    // process.cwd() returns the directory from which you ran Node process 
    var currentDir = process.cwd();
    return path.join(currentDir, 'output');
} 

function headlineTextFlag(headlineText) {
    headlineText = headlineText.toUpperCase();
    return `
// ------------------------------------------------------------
// ${headlineText}
// ------------------------------------------------------------
`;
}

function writeOutputFile(filename, data) {
    var pathToFile = path.join(getOutputDirectory(), filename);
    fs.ensureDir(getOutputDirectory())
    .then(() => {
        fs.writeFile(pathToFile, data);
    })
    .catch(err => {
        if (err.code == 'ENOENT') {
            throw new BadInputException(`No such directory exists: "${getOutputDirectory()}". ${N} Be sure to create an "output" folder in your current directory.`);
        } else {
            throw new RandomException(`Something went wrong writing to the output folder!`);
        }
    });
};

function readInputFile(filepath) {
    fs.ensureFile(filepath)
    .then(() => {
        try {
            return fs.readFileSync(filepath, 'utf8');
        } catch (e) {
            throw new RandomException(`Something went wrong reading the input file!`);
        }
    })
    .catch((err) => {
        throw new RandomException(err.message);
    });
}

function resetProgram(program) {
    var keys = _.keys(program);
    var currentKey = "";
    for (var i = 0; i < keys.length; i++) {
        currentKey = keys[i];
        if (typeof(program[currentKey]) == typeof(true)) {  
            program[currentKey] = false;
        }        
    }
}

module.exports = {
    N,
    headlineTextFlag,
    getInputDirectory,
    getOutputDirectory,
    readInputFile,
    writeOutputFile,
    resetProgram,
    BadInputException,
    RandomException,
    ProdticketException 
};
