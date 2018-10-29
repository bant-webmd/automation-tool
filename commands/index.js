// GENERAL MODULES 
const config = require('../config');
const utils = require('../utils');
const classes = require('../classes');
const prodTicket = require('../prodticket');
const snippets = require('../snippets');
const articles = require('../articles');

// COMMANDS
const inLanguage = require('./in-language');


// Build commands function 
let commands = function (vorpal) {
    inLanguage(vorpal);
}

// ------------------------------------------------------------
// MODULE EXPORTS 
// ------------------------------------------------------------
module.exports = {
    config,
    utils,
    classes,
    prodTicket,
    snippets,
    articles,
    commands     
};