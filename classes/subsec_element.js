const _ = require("lodash");
const XMLElement = require("./xml_element");
const SlideGroup = require("./slide_grp");
const xmlOps = require('../utils/xml-ops');

class SubsectionElement extends XMLElement {
    constructor(hasSlides, hasQnaForm = true, hasFootnotes = false) {
        super("subsec_element", hasQnaForm, hasFootnotes);
        this._hasSlides = hasSlides;
        this._subsectionHeader = {
            "type": "element",
            "name": "subsec_header",
            "elements": []
        };
        this._elements[0] = this._subsectionHeader;

        if (hasSlides) {
            this._slideIntro = {
                "type": "element",
                "name": "slide_intro",
                "elements": []
            };
            this._elements[1] = this._slideIntro;
        } else {
            this._subsectionContent = {
                "type": "element",
                "name": "subsec_content",
                "elements": []
            };
            this._elements[1] = this._subsectionContent;
        }
    }

    get subsectionHeader() {
        this.getParagraphTextField("_subsectionHeader");
    }

    set subsectionHeader(newHeader) {
        this.setParagraphTextField("_subsectionHeader", newHeader);
    }

    get subsectionContent() {
        if (this._hasSlides) {
            if (this._slideIntro.elements[0]) {
                return xmlOps.objectToXMLString(this._slideIntro);
            } else {
                return null;
            }  
        } else {
            if (this._subsectionContent.elements[0]) {
                return xmlOps.objectToXMLString(this._subsectionContent);
            } else {
                return null;
            }
        }
    }

    set subsectionContent(subsectionContent) {
        /* 
            - Pushes the new subsec_content onto the elements array of the subsection
        */
        if (subsectionContent) {
            var subsectionContentObject = xmlOps.xmlStringToJS(subsectionContent);
            var content = subsectionContentObject.elements[0].elements; 
            if (this._hasSlides) {
                for (var i = 0; i < content.length; i++) {
                    this._slideIntro.elements.push(content[i]);
                }
            }
            else {
                for (var i = 0; i < content.length; i++) {
                    this._subsectionContent.elements = content;
                }
            }   
        } else {
            if (this._hasSlides) {
                this._slideIntro.elements = [];
            }
            else {
                this._subsectionContent.elements = [];
            }
        }
    }

    insertSlideGroup(slideGroup) {
        /* 
            - Pushes the new slide_grp onto the elements array of the subsection
        */
        if ((slideGroup) && (slideGroup instanceof SlideGroup)) {
            this.insertChildElement(slideGroup);
        }
    }

}

module.exports = SubsectionElement;

/*
return {
        "type": "element",
        "name": "subsec_element",
        "elements": [
            {
                "type": "element",
                "name": "subsec_header",
                "elements": []
            },
            {
                "type": "element",
                "name": "subsec_content",
                "elements": [
                    {
                        "type": "element",
                        "name": "p",
                        "elements": [
                            {
                                "type": "text",
                                "text": "For stroke victims, the outcomes that matter to clinicians are often not the outcomes that matter most to survivors. Based on previous research, there is a wide distribution of outcomes for patients with normal modified rankin scores (mRS) that pertain to physical function, fatigue, cognition and social function. It is important to understand the outcomes that are most meaningful to patients as it will help in identifying meaningful treatment and rehabilitation options for each patient."
                            }
                        ]
                    }
                ]
            },
            {
                "type": "element",
                "name": "qna_form",
                "elements": []
            }
        };
*/