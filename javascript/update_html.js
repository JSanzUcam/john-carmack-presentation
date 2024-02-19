/**
 * Updates the title and stores its new value in jsp_titleText
 * 
 * @param {String} newTitle 
 */
function updateTitle(newTitle) {
    jsp_titleText = newTitle;
    document.getElementById("title").innerHTML = newTitle;
}

/**
 * Interprets the body of the data file, stores its contents
 * in the main div and saves the original string into jsp_bodyText
 * 
 * @param {String} lines 
 */
function updateDiv(bodyText) {
    // Split lines
    var lines = bodyText.split('\n');

    // First of all, we got a body text string and
    // we're not playing doom right now;
    // we should save this string to the variable
    // jsp_bodyText found in jsp_vars.js
    jsp_bodyText = bodyText;

    // We need to check if it's normal text or a list
    // If we're on normal text we add <br> tags for every
    // \n, if it's a list we end the previous paragraph
    // and start a new list.
    // Same thing if we were on a list and now we're in
    // a paragraph

    // Am I or Were I in a list?
    var wereInList = null;
    var isInList = false;

    // Node to write to and text in paragraph
    var node = null;
    var textInP = "";

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // We update isInList depending on the two first chars
        if (line.substring(0, 2) == "- ") {
            isInList = true;
            console.log("We're in a list")
        } else {
            isInList = false;
            console.log("We're in normal text")
        }

        // Do we need to create a new element?
        if (isInList && (!wereInList || wereInList == null)) {
            if (node != null && textInP.length != 0) {
                textInP = textInP.substring(0, textInP.length-1);

                var textNode = document.createTextNode(textInP);
                node.appendChild(textNode);
                addToDiv(node);
            }

            // We're going to be goofy ahh and not create the ul
            // element lmfao
        }
        else if (!isInList && (wereInList || wereInList == null)) {
            node = document.createElement("p");
            textInP = "";
        }

        // Are we on a list?
        if (isInList) {
            node = document.createElement("li");
            var textNode = document.createTextNode(line.substring(2));
            node.appendChild(textNode);
            addToDiv(node);
        }
        // if we're not, we're on a paragraph, so do this:
        else {
            textInP += line + '\n';
        }

        // update wereInList
        wereInList = isInList
    }

    if (!isInList) {
        if (node != null && textInP.length != 0) {
            textInP = textInP.substring(0, textInP.length-1);

            var textNode = document.createTextNode(textInP);
            node.appendChild(textNode);
            addToDiv(node);
        }
    }
}

/**
 * Adds a HTML something as a child to the main Div
 * 
 * @param {*} node 
 */
function addToDiv(node) {
    const div = document.getElementById("slidediv");
    div.appendChild(node);
}

/**
 * Removes every child of the main Div
 */
function cleanDiv() {
    const div = document.getElementById("slidediv");

    // First we remove the previous contents of the div
    while (div.hasChildNodes()) {
        div.removeChild(div.firstChild);
    }
}

/**
 * Edits the color of the title and its jsp variable
 * 
 * @param {*} value 
 */
function editTitleColor(value) {
    jsp_titleStyle = value;

    const titleElem = document.getElementById("title");
    titleElem.style.color = value;
}

/**
 * Edits the color of the body and its jsp variable
 * 
 * @param {*} value 
 */
function editBodyColor(value) {
    jsp_bodyStyle = value;

    document.body.style.color = value;
}

function editBG(url) {
    jsp_bgURL = url;
    
    document.body.style.backgroundImage="url('"+ url +"')";
}