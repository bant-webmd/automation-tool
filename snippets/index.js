const activity = require('./activity');
const inLanguage = require('./in-language');
const preContent = require('./pre-content');
const copyrightHolder = require('./copyright-holder');
const backmatter = require('./backmatter');
const utils = require('../utils');

function downloadablePDF (articleID, nameOfAddon, pdfFilename) {
    var result = `<div class="downloadbtn">
            <div class="downloadbtn_lt"></div>
            <div class="downloadbtn_bg_pdf">
                <a href="/px/trk.svr/${articleID}?exturl=http://img.medscape.com/images/${articleID.slice(0, 3)}/${articleID.slice(3)}/${pdfFilename}" target="_blank">${nameOfAddon}</a>
            </div>
            <div class="downloadbtn_rt"></div>
            <div class="spacer">&nbsp;</div>
        </div>
        <div class="spacer">&nbsp;</div>`;
    return utils.cleanHTML.insertEntityPlaceholders(result);
}

function forYourPatient(articleID) {
    return downloadablePDF(articleID, "For Your Patient", `${articleID}_ForYourPatient.pdf`);
}

function downloadableSlides(articleID) {
    var result = `<div id="dlSlides">
        <p>A Powerpoint version of the slides from this presentation<br />
            is available for use as a professional resource from Medscape Education.</p>
        <div class="dlBtn"><a class="cme_btn" href="https://img.medscapestatic.com/images/${articleID.slice(0, 3)}/${articleID.slice(3)}/${articleID}_slides.pptx" target="_blank">Download Now</a></div>
    </div>`;
    return utils.cleanHTML.insertEntityPlaceholders(result);
}

function videoEmbed (slidesComponent, articleID=null) {
    var result = "";
    if (articleID) {
        result = `
        <div class="app-loading">        
            <div class="webcomp-player" data-config="en/pi/editorial/studio/configs/2019/education/${articleID}/${articleID}.json" data-playertype="edu" id="cme-video-player">
                &nbsp;
            </div>
        </div>
        `;
        return utils.cleanHTML.insertEntityPlaceholders(result);
    } 
    // IF NO ARTICLE ID USE SLIDES COMPONENT TO BUILD SNIPPET 
    var videoEmbedPath = function () {
        if (slidesComponent.componentNumber) {
            return `${slidesComponent.articleID}/${slidesComponent.articleID}_${slidesComponent.componentNumber + 1}`;
        } else {
            return `${slidesComponent.articleID}/${slidesComponent.articleID}`;
        }
    }

    if (slidesComponent.componentNumber) {
        result = `
        <div class="app-loading">
            <div class="webcomp-player" data-config="en/pi/editorial/studio/configs/2019/education/${videoEmbedPath()}.json" data-playertype="edu" id="cme-video-player">
                &nbsp;
            </div>
        </div>
        `;
    } else {
        result = `
        <div class="app-loading">
            <div class="webcomp-player" data-config="en/pi/editorial/studio/configs/2019/education/${videoEmbedPath()}.json" data-playertype="edu" id="cme-video-player">
                &nbsp;
            </div>
        </div>
        <div id="page_nav_top">
            <div id="prev_page_nav">
                <a href="${slidesComponent.articleID}">« Back </a>
            </div>
            <div id="next_page_nav">
                <a href="${slidesComponent.articleID}_3">Next»</a>
                <a href="javascript:next_toc();" id="next_toc_link" style="height: 17px;">
                    <img alt="" border="0" class="inline_img" src="http://img.medscape.com/pi/cme/ornaments/arrow-next-toc.png"/>
                </a>
            </div>
            <div class="spacer">
                &nbsp;
            </div>
        </div>`;
    }
    return utils.cleanHTML.insertEntityPlaceholders(result);
}

function tableOfContents(componentsArray, articleID) {
    var styles = `
    <style type="text/css">
        div.articleTitle {
            font-size: 1.2em;
            font-weight: bold;
        }

        div#prgteaser {
            clear: left;
            padding-top: 10px;
        }
    </style>
    `;

    var introStatement = `\n<p>All sections of this activity are required for credit.</p>`;

    var componentSection = ``;
    var component = null; 
    for (var i = 0; i < componentsArray.length; i++) {
        component = componentsArray[i];
        componentSection += `\n
        <div id="prgteaser">
            <img src="professional_assets/medscape/images/thumbnail_library/${articleID}_${component.componentNumber + 1}.jpg?interpolation=lanczos-none&resize=200:150" alt="" />
            <h4>${component.title}</h4> ${component.teaser}<br /> <em>${component.byline}</em>
        </div>`;
    }

    var endSpacer = `\n<div class="spacer">&nbsp;</div>`;
    result = styles + introStatement + componentSection + endSpacer;
    return utils.cleanHTML.insertEntityPlaceholders(result);
}

function caseImage(articleID, contentMarkup, caseNumber) {
    return `
    <table style="margin-right: 20px;" align="left" border="1" bordercolor="#b3b3b3" cellpadding="3" cellspacing="0">
        <tbody>
            <tr>
                <td align="center">
                    <img src="/webmd/professional_assets/medscape/images/content/article/${articleID.slice(0, 3)}/${articleID.slice(3)}/${articleID}-patient${caseNumber}.jpg?interpolation=lanczos-none&resize=200:150" alt="" border="0" width="200" />
                </td>
            </tr>
        </tbody>
    </table>
    <p style="min-height: 230px;">
        ${contentMarkup}
    </p> 
    `;
}

module.exports = {
    videoEmbed,
    downloadableSlides,
    downloadablePDF,
    forYourPatient,
    inLanguage,
    preContent,
    copyrightHolder,
    backmatter,
    tableOfContents,
    activity,
    caseImage
};