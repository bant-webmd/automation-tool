const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    var {textBlock: newsAuthor, label: newsAuthorLabel} = stringOps.getTextBlock(ticketHTML, "News Author", 'CME Author');

    var {textBlock: cmeAuthor, label: cmeAuthorLabel} = stringOps.getTextBlock(ticketHTML, "CME Author", 'Editor');
    
    newsAuthor = cleanHTML.singleLine(cleanHTML.plainText(newsAuthor)).trim();
    cmeAuthor = cleanHTML.singleLine(cleanHTML.plainText(cmeAuthor)).trim(); 

    return `<p>${newsAuthorLabel}: ${newsAuthor}; ${cmeAuthorLabel}: ${cmeAuthor}</p>`;
}

exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "Faculty/Author(s) Byline(s): &#953;", "Indicate thumbnail URL");
    return "<p>" + cleanHTML.singleLine(cleanHTML.plainText(textBlock)).trim() + "</p>";
}

exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

module.exports = exportObject;