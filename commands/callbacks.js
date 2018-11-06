// PROMISE THEN CALLBACK 
// ------------------------------------------------------------
function promiseCallback(self, callback, program, answers, nameOfPrompt, nextFunction) {
    if (answers) {
        if (answers[nameOfPrompt]) {
            program[nameOfPrompt] = answers[nameOfPrompt];
        } 
        if (nextFunction) {
            return nextFunction(self);                                         
        } else {
            callback();
        }                
    } else {
        self.log(`Not getting answers for ${nameOfPrompt}`);
        callback();
    } 
} 


module.exports = {
    promiseCallback
}