// ------------------------------------------------------------
// COMMAND FOR GENERATING TOWNHALL ENDURING XML 
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const _ = require('lodash');
const fs = require('fs');

const utils = require('../../utils');
const articles = require('../../articles');
const cliTools = utils.cliTools;
const N = cliTools.N;
let config = require('../../config');
let actions = require('../actions');


// VARS
// ------------------------------------------------------------
const testAndTeachHelp = `
Generates Test and Teach XML code from R2Net html file. Input directory: /test-and-teach/article.html`;


let inputFile = function () {
    return cliTools.getInputDirectory() + '/test-and-teach/article.html';
}

let outputFiles = function () {
    return {
        xmlFile: `${program.articleID}/${program.articleID}.xml`,
        checklist: `${program.articleID}/${program.articleID}_checklist.html`,
        activity: `${program.articleID}/${program.articleID}_activity.xml`
    };
};    

let program = config.programs.testAndTeach;


// BUILD FUNCTION LOGIC 
// ------------------------------------------------------------

let buildFinalOutput = function (self) {
    var prodTicket = cliTools.readInputFile(inputFile());  
    return articles.testAndTeach.buildTestAndTeach(prodTicket, program);
}


// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('generate test-and-teach <articleID>', testAndTeachHelp)
    .types({string: ['_']})
    .action(function(args, callback) {       
        program.articleID = args.articleID;        
        let self = this;
        actions.testAndTeachAction(vorpal, self, callback, chalk, program, buildFinalOutput, outputFiles);
    });
    vorpal.on('client_prompt_submit', function (program){
        cliTools.resetProgram(program);
    });
};
