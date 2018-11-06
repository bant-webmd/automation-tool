const _ = require("lodash");
const utils = require("../utils");
const articleUtils = require('./article-utils');
const {ProfArticle, TOCElement, SectionElement, SubsectionElement, SlideGroup} = require("../classes");
const prodticket = require('../prodticket');
const snippets = require('../snippets');


/* SLIDES / MAIN CONTENT 
-------------------------------------- */
function getSlidesTOCs (ticket, program) {
    // Get Slide Component from prodticket.getSlides.
    // Check if LLA 
    // If LLA build slides with Video embed AND Edu Impact challenge 
    var slidesComponents = prodticket.getSlides(ticket, program);

    // var slideTOCs = [];
    
    // for (var i = 0; i < slidesComponents.length; i++) {            
    //     if (i == slidesComponents.length - 1) {
    //         // console.log(`COMPONENT: ${i + 1}`, utils.xmlOps.objectToXMLString(articleUtils.buildSlidesTOC(slidesComponents[i]).toObjectLiteral()));
    //         slideTOCs.push(articleUtils.buildSlidesTOC(slidesComponents[i], true, true, true));
    //     } else {
    //         console.log(`COMPONENT: ${i + 1}`, slidesComponents[i]);
    //         slideTOCs.push(articleUtils.buildSlidesTOC(slidesComponents[i], true, true, false));
    //     }
    // }
    // return slideTOCs;
    return slidesComponents;
}


/* LLA PRE TOC   
-------------------------------------- */
function getLLAPreTOC(ticket, program) {
    var goalStatementMarkup = prodticket.getGoalStatement(ticket, program);
    return articleUtils.buildLLAPreTOC(goalStatementMarkup);
}


/* LLA POST TOC  
-------------------------------------- */
function getLLAPostTOC(ticket, program) {
    return articleUtils.buildLLAPostTOC();
}


/*
Main sections to include: 
    1) TITLE - COMPLETE         
    2) CONTRIBUTOR PAGE INFO - COMPLETE 
        - BYLINE: 
        - CONTRIBUTOR POST CONTENT / Peer Reviewer:             
    3) BANNER - INCOMPLETE    
    4) SLIDES CONTENT - COMPLETE  
    5) PRE/POST ASSESSMENT - COMPLETE
    6) BLANK RESULTS PAGE - COMPLETE
    7) ABBREVIATIONS - COMPLETE
    8) REFERENCES - COMPLETE 
*/
/* MASTER FUNCTION 
-------------------------------------- */
function buildFirstResponse(ticket, program) {
    var title, 
    byline, 
    peerReviewer, 
    collectionPageInfo, 
    slidesTOCs, 
    preAssessmentTOC, 
    postAssessmentTOC, 
    blankResultsTOC, 
    abbreviationsTOC,
    referencesTOC,
    slideDeckDiv,
    forYourPatientMarkup;

    title = prodticket.getTitle(ticket, program);
    byline = prodticket.getByline(ticket, program);
    if (program.hasPeerReviewer) {
        peerReviewer = prodticket.getPeerReviewer(ticket, program);
    } 
    if (program.hasCollectionPage) {
        collectionPageInfo = prodticket.getCollectionPage(ticket, program);
    }
    if (program.hasLLA) {
        preAssessmentTOC = getLLAPreTOC(ticket, program);
        postAssessmentTOC = getLLAPostTOC(ticket, program);
        blankResultsTOC = articleUtils.buildBlankTOC();
    }

    slidesTOCs = getSlidesTOCs(ticket, program); 
    var abbreviationsMarkup = prodticket.getAbbreviations(ticket, program);
    abbreviationsTOC = articleUtils.buildAbbreviations(abbreviationsMarkup, program);

    var referencesMarkup = prodticket.getReferences(ticket, program);
    referencesTOC = articleUtils.buildReferences(referencesMarkup, program);

    slideDeckDiv = snippets.downloadableSlides(program.articleID);
    

    // Build Main Article Object - Instantiate and Populate Article
    var finalArticle = new ProfArticle("SlidePresentation");
    // Set article title (pass markup)
    finalArticle.titleText = title;
    // Set article byline (pass markup)
    finalArticle.contrbtrByline = byline;
    // remove existing contrbtr_pre_content
    finalArticle.contrbtrPreContent = null;
    // insert peer reviewer
    finalArticle.contrbtrPostContent = peerReviewer;
    // insert collection page info - Banner image and Above title
    if (collectionPageInfo) {
        finalArticle.bannerImage = collectionPageInfo.bannerFileName;
        finalArticle.insertAboveTitleCA(collectionPageInfo.title, collectionPageInfo.advancesFileName);
    } 
          
    // Insert Main TOC Objects  
    finalArticle.insertTOCElement(preAssessmentTOC);
    for (var i = 0; i < slidesTOCs.length; i++) {
        finalArticle.insertTOCElement(slidesTOCs[i]);
    }
    finalArticle.insertTOCElement(postAssessmentTOC);
    finalArticle.insertTOCElement(blankResultsTOC);
    finalArticle.insertTOCElement(abbreviationsTOC);
    finalArticle.insertTOCElement(referencesTOC);

    // Addons 
    if (program.hasForYourPatient) {
        forYourPatientMarkup = snippets.forYourPatient(program.articleID, "For Your Patient", `${program.articleID}_ForYourPatient.pdf`);
        // console.log("FINAL ARTICLE CHILD ELEMENTS: ", finalArticle._childElements[0]._childElements[0]);
        var forYourPatientSubsection = new SubsectionElement(true, false, false);
        
        if (program.hasLLA) {
            var slideGroup = new SlideGroup('', '', true, false);
            slideGroup.sectionImage = null;
            slideGroup.sectionLabel = null;
            slideGroup.sectionAltText = null;
            slideGroup.qnaForm = 3;
            forYourPatientSubsection.insertSlideGroup(slideGroup);
            finalArticle._childElements[0]._childElements[0]._childElements[0]._childElements = [];
        }

        forYourPatientSubsection.subsectionContent = utils.wrapSlideIntro(forYourPatientMarkup);

        finalArticle._childElements[0]._childElements[0].insertSubsectionElement(forYourPatientSubsection); 
    }
    
    return finalArticle;
};

module.exports = {
    getSlidesTOCs,
    getLLAPreTOC,
    getLLAPostTOC,
    buildFirstResponse
}