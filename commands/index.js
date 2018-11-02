// GENERAL MODULES 
const config = require('../config');
const utils = require('../utils');
const classes = require('../classes');
const prodTicket = require('../prodticket');
const snippets = require('../snippets');
const articles = require('../articles');

// COMMANDS
const inLanguage = require('./in-language');
const brief = require('./clinical-brief');
const spotlight = require('./spotlight');
const curbside = require('./curbside-consult');


// Build commands function 
let commands = function (vorpal) {
    inLanguage(vorpal);
    brief(vorpal);
    spotlight(vorpal);
    curbside(vorpal);
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