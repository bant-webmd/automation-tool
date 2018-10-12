'use strict';
/*
TODO: 
    - Create the slide_grp class - done 
    - Refactor findNextSymbol into findNextSlide - done
    - Implement buildSlides() algorithm - done
*/

const testString = `
<p><strong>&lt;&lt;insert slide [1]; 00:00; Note to EA &#8211; Chapter Title: Introductions&gt;&gt;</strong></p>
<p><strong>&lt;&lt;Level 2&gt;&gt; Biotherapeutics: Understanding Immunogenicity for Clinical Practice</strong></p>
<p><strong>&lt;&lt;insert slide [2]; 00:19&gt;&gt;</strong></p>
<p><strong>&lt;&lt;Level 2&gt;&gt; Faculty</strong></p>
<p><strong>&lt;&lt;insert slide [3]; 00:39&gt;&gt;</strong></p>
<p><strong>&lt;&lt;Level 2&gt;&gt; Introduction<sup>[1-5]</sup></strong></p>
<p></p>

<p><strong>&lt;&lt;insert slide [4]; 01:17&gt;&gt;</strong></p>
<p><strong>&lt;&lt;Level 2&gt;&gt; Program Outline</strong></p>
<p></p>

<p><strong>&lt;&lt;insert slide [5]; 01:39; Note to EA &#8211; Chapter Title: ADA Development&gt;&gt;</strong></p>
`;




const _ = require('lodash');
const xmlOps = require('./xml-ops');
const SlideGroup = require('../classes/slide_grp');
const cleanHTML = require('./clean-html');
const findLastAndReplace = require('./string-ops').findLastAndReplace;
const findFirstAndReplace = require('./string-ops').findFirstAndReplace;

// Different variations of "insert slide" markers generated by prodticket  
const slideSymbolType1 = `<strong>&lt;&lt;insert slide`;
const slideSymbolType2 = `&lt;&lt;insert slide`;

function findNextSlide(substring) {

    var nextSlideType1 = {
        index: substring.search(slideSymbolType1),
        symbol: slideSymbolType1,
        isInString: function () {
            return this.index != -1;
        }
    };

    var nextSlideType2 = {
        index: substring.search(slideSymbolType2),
        symbol: slideSymbolType2,
        isInString: function () {
            return this.index != -1;
        }
    };

    var options = [nextSlideType1, nextSlideType2];
    _.pullAllBy(options, [{index: -1}], 'index');

    var minimum = undefined;
    for (var i = 0; i < options.length; i++) {
        if (!minimum) {
            minimum = options[i];
        } else {
            minimum = (minimum.index > options[i].index ? options[i] : minimum);
        }
    }
    if (minimum) {
        return minimum;
    } else {
        return -1;
    }
}

// console.log(findNextSlide(testString));

// Slide Path ${articleID.slice(0, 3)}/${articleID.slice(3)}
let buildSlidesXML = (substring, subsectionElement, slidePath = "XXX/XXX", counter = 0, fn) => {
    var nextSlideSymbol = findNextSlide(substring);
    if (nextSlideSymbol != -1) {
        // Remove insert slide line 
        var slideRegExp = new RegExp(nextSlideSymbol.symbol + `(.*)`);
        substring = substring.replace(slideRegExp, "");

        // Find the next "insert slide"
        // Use it's index as a stopping point for current slide's content 
        var upcomingSlideSymbol = findNextSlide(substring);
        
        // Grab the slide's content 
        var slideContent = "";
        if (upcomingSlideSymbol != -1) {
            slideContent = substring.substring(0, upcomingSlideSymbol.index);
            substring = substring.substring(upcomingSlideSymbol.index);
        } else {
            slideContent = substring;
        }

        
        // // Wrap lists in <ul> tags 
        // var li = '<li>';
        // var liClose = '</li>';
        // if (slideContent.includes(li)) {
        //     slideContent = findFirstAndReplace(slideContent, li, '<ul><li>');
        //     slideContent = findLastAndReplace(slideContent, liClose, '</li></ul>');
        //     console.log(slideContent);
        // }
        
        // Turn Content into JS object
        // console.log(slideContent);
        // slideContent = xmlOps.xmlStringToJS(`<sec_txt>${slideContent}</sec_txt>`);
        slideContent = `<sec_txt>${slideContent}</sec_txt>`;
        
        // Increment counter to reflect Slide #
        counter++;

        // Create new Slide Group XML object and insert Slide Content as section text
        var slide_grp = new SlideGroup(slidePath, counter);
        slide_grp.sectionText = (slideContent);

        // Push slide_grp onto subsection element 
        subsectionElement.insertSlideGroup(slide_grp);

        // Continue recursive definition
        return fn(substring, subsectionElement, slidePath, counter, buildSlidesXML);
    } else {
        return subsectionElement;
    }
};

let buildSlides = function (substring, subsectionElement, slidePath) {
    var cleanSlides = cleanHTML.slidesFinal(substring);
    return buildSlidesXML(cleanSlides, subsectionElement, slidePath, 0, buildSlidesXML);
};

/* 
Algorithm 
function buildSlides(string, subsectionElement, slidePath = "XXXXXX") {
    - index = Find next slide (Use findNextSymbol w/ `&lt;&lt;insert slide`
    if (index != -1) {
        - Remove `&lt;&lt;insert slide` entire line      
        - substr = string.substring(0, index)
        - string = string.replace(substr, "");
        
            - 
        - insert slide into subsectionElement
        - return buildSlides(string, subsectionElement);
    } else {
        return subsectionElement;
    }
}

*/


module.exports = buildSlides;

