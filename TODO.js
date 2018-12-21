/*
TODO: Strategy for Handling missing info / not finding info in prodticket 
- prodticket function runs
    - checklist function runs and uses results of what is found
    - checklist function could then return an array of components to include in the build function 
        - This makes sense because if the checklist deems it "Not found" we shouldn't try to build the corresponding TOC element. 
- basically we need a better interface between actually building XML and scanning for text in prodticket. 
*/ 

/* 
TODO / STRATEGY: Producer Checklist  
    - Given a program (configured by user input)
    - Output a text file with all relevant information 
        - Create a build...Checklist() function for each program that will simply output the raw markup that needs to be put into D2
    - buildProgramChecklist():
        - Use all of the prodticket functions to find the information
            - Should create prodticket functions to find article properties 
            - Make two separate output files.
                - Producer checklist (article properties).
                    - Title: 'Title &#953;' 
                    - Window Title Override: 'Title &#953;'                     
                    - User Description: 'Teaser &#953;'
                    - Meta Description: 'Teaser &#953;'
                    - Questionnaire: nothing to find here just return "Double Check QA ID"
                    - Product Name: 'Product Type:'
                    - Project ID: 'Activity SF#' --> return "Enter First SF#"
                    - Bucket Collections: --> return "Check Bucket Collection"
                    - Primary Collections: --> return "Check Primary Collection"
                    - Supporter: Search 'Supporter(s)' --> return "Double Check Supporter"
                    - Publication: --> return "Fill Publication. None for Pat Ed, Medscape, specialty. No bots for OUS."
                    - Badge --> ?? 
                - Prodticket checklist (all prodticket info).  
        - This should work because they are already dynamic
        - Set up corresponding "checklist" commands.  
            - EXAMPLE: checklist spotlight <articleID>
                - articleID is necessary because the output file will need a naming system. 
        - Checklist command will run through normal article prompt chain 
            - hasOUS, hasLLA, etc.
            - Checklist function will automatically run when you call build...() function   
*/

/*
TODO 
- Update config with new town hall objects - DONE
- Update prodticket modules with new config objects - DONE 
- Update prodticket test suite with new config objects - DONE
- Handle Edge cases in build slides - **** NO SOLUTION YET **** 
    - Update cleaning functions to cover the following:  
    - case where <<Level 2>> is NOT bolded
    - case where <<insert slide has a bullet symbol next to it
*/ 