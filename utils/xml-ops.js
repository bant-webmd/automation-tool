const convert = require('xml-js');
const fs = require('fs');

function xmlStringToJS(xmlString) {
    var options = { compact: false, alwaysChildren: true, spaces: 4 };
    var result = convert.xml2js(xmlString, options);
    return result;
}

function xmlFileToJS(pathToFile) {
    var xml = fs.readFileSync(pathToFile, 'utf8');
    var options = { compact: false, alwaysChildren: true, ignoreComment: true, alwaysChildren: true };
    var result = convert.xml2js(xml, options); // or convert.xml2json(xml, options)
    return result;
}

function writeXMLFromObject(object, pathToFile) {
    // Need options or the file will be output as empty. 
    var options = { compact: false, fullTagEmptyElement: true};
    var result = convert.js2xml(object, options);
    fs.writeFile(pathToFile, result, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The new file was created!");
    });
}

module.exports = {
    xmlStringToJS,
    xmlFileToJS,
    writeXMLFromObject,
};