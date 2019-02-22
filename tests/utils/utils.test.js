var fs = require('fs');
var expect = require('chai').expect;

const app = require('../../commands');
var utils = app.utils;
const SubsectionElement = app.classes.SubsectionElement;

describe('Utility Functions', function () {

    var xmlJSObject;
    var xmlJSObjectTrimmed;
    var dirtyListHTML = fs.readFileSync(__dirname + '/input/dirty-list.html', 'utf8');
    var dirtySlidesHTML = fs.readFileSync(__dirname + '/input/dirty-slides-html.html', 'utf8');
    var dirtySlidesHTML2 = fs.readFileSync(__dirname + '/input/dirty-slides-html2.html', 'utf8');

    var slidesInitialComplete = fs.readFileSync(__dirname + '/input/slides-initial-complete.html', 'utf8').toString();
    var slidesFinalComplete = fs.readFileSync(__dirname + '/input/slides-final-complete.html', 'utf8').toString();

    var testAndTeachTicket = fs.readFileSync(__dirname + '/../prodticket/input/prodticket-tt-902362.html').toString();

    beforeEach(function() {
        // prodTicket = fs.readFileSync(__dirname + '/input/article.html', 'utf8');
        xmlJSObject = require('./input/xml-js-object');
        xmlJSObjectTrimmed = require('./input/xml-js-object-trimmed');
    });
    
    // describe('#getTextBlock()', function () {
    //     var prodticketSL = fs.readFileSync(__dirname + '/input/prodticket-sl.html').toString();
    //     it('should return text between specified start and end RegExp', function () {
    //         console.log(utils.stringOps.getTextBlock(prodticketSL, /&lt;&lt;.*slide 1/g, /&lt;&lt;end slides&gt;&gt;/g));
    //     });
    // });

    describe('utils.trimObjectText()', function () {
        it('should return trimmed "text" property of JavaScript Object', function () {
            var result = utils.trimObjectText(xmlJSObject)
            // console.log(xmlJSObject);
            expect(result).to.deep.equal(xmlJSObjectTrimmed);
        });
    });

    describe('utils.stringOps.removeFromRegexCapture()', function () {
        it('should remove a regex string ONLY within a specified regex match', function () {
            var h3RegExp = new RegExp('<h3>(.*)</h3>', 'g');
            var strongRegExp = new RegExp('<strong>|</strong>', 'g');            
            var testString = `
                <h3><strong>Stuff</strong></h3>
                <strong>MORE</strong>
                Other
                <h3><strong>Stuff</strong></h3>
            `;
            var completeString = `
                <h3>Stuff</h3>
                <strong>MORE</strong>
                Other
                <h3>Stuff</h3>
            `;
            var result = utils.stringOps.removeFromRegexCapture(
                testString,
                h3RegExp,
                strongRegExp
            );
            expect(result).equalIgnoreSpaces(completeString);
        });
    });

    describe("utils.formatLearningObjectives()", function () {
        var learningObjectivesCB = fs.readFileSync(__dirname + '/input/learning-objectives-cb.html').toString();
        var learningObjectivesSL = fs.readFileSync(__dirname + '/input/learning-objectives-sl.html').toString();
        var learningObjectivesCC = fs.readFileSync(__dirname + '/input/learning-objectives-cc.html').toString();

        var formattedObjectivesCB = fs.readFileSync(__dirname + '/input/formatted-objectives-cb.html').toString();
        var formattedObjectivesSL = fs.readFileSync(__dirname + '/input/formatted-objectives-sl.html').toString();
        var formattedObjectivesCC = fs.readFileSync(__dirname + '/input/formatted-objectives-cc.html').toString();

        it("should format cleaned learning objectives into format usable by formatList() - Clinical Brief", function () {
            var result = utils.formatLearningObjectives(learningObjectivesCB);
            expect(result).to.equalIgnoreSpaces(formattedObjectivesCB);
        });

        it("should format cleaned learning objectives into format usable by formatList() - Spotlight", function () {
            var result = utils.formatLearningObjectives(learningObjectivesSL);
            expect(result).to.equalIgnoreSpaces(formattedObjectivesSL);
        });

        it("should format cleaned learning objectives into format usable by formatList() - Curbside", function () {
            var result = utils.formatLearningObjectives(learningObjectivesCC);
            expect(result).to.equalIgnoreSpaces(formattedObjectivesCC);
        });
    });

    describe("utils.cleanHTML", function () {
        describe(".unorderedList()", function () {
            it('should transform list generated by R2Net into proper <ul><li> list.', function () {
                var result = utils.cleanHTML.unorderedList(dirtyListHTML);
                fs.writeFileSync(__dirname + "/output/clean-list.html", result, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                }); 
            });
        });
    
        describe(".slidesInitial()", function () {
            it('should transform Slides HTML from from R2Net into format suitable for initial processing/formatting.', function () {
                var result = utils.cleanHTML.slidesInitial(dirtySlidesHTML);
                // fs.writeFileSync(__dirname + "/output/fixed-slides.html", result, function(err) {
                //     if(err) {
                //         return console.log(err);
                //     }
                // }); 
                expect(result).to.equalIgnoreSpaces(slidesInitialComplete);
            });
        });
    
        describe(".slidesFinal()", function () {
            it('should transform Slides HTML from from R2Net into format for use in buildSlides().', function () {
                var result = utils.cleanHTML.slidesFinal(slidesInitialComplete);
                fs.writeFileSync(__dirname + "/output/clean-slides.html", result, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                }); 
                expect(result).to.equalIgnoreSpaces(slidesFinalComplete);
            });
        });

        describe(".slidesInitial() + .slidesFinal()", function () {
            it('should fully format dirty slides HTML', function () {
                var result = utils.cleanHTML.slidesInitial(dirtySlidesHTML2);
                result = utils.cleanHTML.slidesFinal(result);
                fs.writeFileSync(__dirname + "/output/clean-slides2.html", result, function(err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            });
        });
    });

    describe('utils.stringOps.getAllBlocksInOrder()', function () {
        it('should get all matching substrings of text using arrays of regular expressions', function () {
            var startRegexps = [
                /<strong>Content/g,
                // /(?:&lt;){1,}level 1(?:&gt;){1,}.*Case \d:.*/gi,
                /&lt;&lt;level 1&gt;&gt;.*Case \d:.*/gi,
                /.*Case \d Conclusion<\/strong>/gi,
                /level 2&gt;&gt;.*Discussion/gi
            ];

            var endRegexps = [
                /(?:<strong>){0,}Answer Explanation (?:&#953;){0,}:.*/g,
                /.*Answer Explanation:.*/g,
                // /.*Case \d Conclusion<\/strong>/gi,
                /(?:&lt;){1,}level 1(?:&gt;){1,}.*Case \d:.*/gi,
                /&lt;&lt;level 1&gt;&gt;.*Case \d:.*/gi
            ];
            /* 
            TYPES OF BLOCKS 
            CONTENT --> Question (Include end)

            discussion --> Question (Include end)

            discussion --> New Case (Include end)

            New Case --> Question (Include end)
            */

            /* 
            Get all text blocks algorithm 
            - substring = textblock.slice();
            - startReg = getNextRegex(textblock, startArray)
            - if (startReg != -1): 
                - substring = textblock.substring(startReg.index);
            - endReg = getNextRegex(substring, endArray);
            - if (endReg != -1): 
                - getTextBlock(substring, startReg, endReg, false, true);
            */
            var {textBlock} = utils.stringOps.getTextBlock(testAndTeachTicket, /<strong>Content/g, /<strong>Abbreviations/g, false, true);

            var result = utils.stringOps.getAllBlocksInOrder(textBlock, startRegexps, endRegexps);

            // console.log("RESULT: ", result);

            var resultString = "";
            for(var i = 0; i < result.length; i++) {
                resultString += "\n\n\n-----------TOC ELEMENT # " + (i+1) + " " + result[i].textBlock;
            }
            fs.writeFileSync(__dirname + '/output/get-all-blocks.html', resultString);
            // expect(result).equalIgnoreSpaces(completeString);
        });
    });
});

