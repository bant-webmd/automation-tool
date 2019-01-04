const _ = require('lodash');
const utils = require('../utils');
const printFunctions = utils.printFunctions;
const {stripIndent} = require('common-tags');
const ArticleChecklist = require("./article_checklist");


class FirstResponseChecklist extends ArticleChecklist {
    constructor() {  
        super();
        this.abbreviations = {result: null, printFn: printFunctions.printStringProp, printName: "ABBREVIATIONS"};
        this.bkmtrFront = {result: null, printFn: printFunctions.printStringProp, printName: "BACK MATTER FRONT PAGE"};
        this.byline = {result: null, printFn: printFunctions.printStringProp, printName: "CONTRIBUTOR BYLINE"};
        this.collectionPageInfo = {result: null, printFn: printFunctions.printStringProp, printName: "COLLECTION PAGE INFO"};
        this.contrbtrPreContent = {result: null, printFn: printFunctions.printStringProp, printName: "CONTENT ABOVE CONTRIBUTORS"};
        this.cpyrtHolder = {result: null, printFn: printFunctions.printStringProp, printName: "COPYRIGHT HOLDER"};
        this.creditsAvailable = {result: null, printFn: printFunctions.printStringProp, printName: "CREDITS AVAILABLE"};
        this.downloadableSlides = {result: null, printFn: printFunctions.printStringProp, printName: "DOWNLOADABLE SLIDES SNIPPET"}
        this.goalStatement = {result: null, printFn: printFunctions.printStringProp, printName: "GOAL STATEMENT"};
        this.learningObjectives = {result: null, printFn: printFunctions.printStringProp, printName: "LEARNING OBJECTIVES"};
        this.locationInfo = {result: null , printFn: printFunctions.printStringProp, printName: "LOCATION INFORMATION"};
        this.peerReviewer = {result: null , printFn: printFunctions.printStringProp, printName: "PEER REVIEWER"};
        this.references = {result: null , printFn: printFunctions.printStringProp, printName: "REFERENCES"};
        this.targetAudience = {result: null , printFn: printFunctions.printStringProp, printName: "TARGET AUDIENCE"};
        this.teaser = {result: null , printFn: printFunctions.printStringProp, printName: "TEASER"};
        this.title = {result: null , printFn: printFunctions.printStringProp, printName: "TITLE"};

        // SPECIAL PRINT FUNCTIONS 
        this.components = {result: null, printFn: printFunctions.printComponents, printName: "ARTICLE COMPONENTS"};
        this.slides = {result: null , printFn: printFunctions.printSlides, printName: "SLIDES"}; 
        this.contributors = {result: null, printFn: printFunctions.printContributors, printName: "CONTRIBUTOR DISCLOSURES AND AFFILIATIONS"}; 
    }

    //--------------------------------
    // COMPUTED PROPERTIES  
    //--------------------------------
}

module.exports = FirstResponseChecklist;