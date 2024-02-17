// Number of Slide + Change Slide with arrow keys
var _slideNum = 0;
var _maxSlide = 9999999;
var ci = null;
window.addEventListener('keydown', event => {
    if (event.key == "ArrowLeft") {
        if (_slideNum > 0) {
            loadSlide(_slideNum-1);
        }
    } else if (event.key == "ArrowRight") {
        if (_slideNum < _maxSlide) {
            loadSlide(_slideNum+1);
        }
    }
})

// Load Cover of presentation, just loads the first slide
// The first slide is slide 0
function loadTitle() {
    loadSlide(_slideNum);
}

// Tries to get files from the folder named 'id'
// The files are:
//  - data.txt: the contents will be put on the slide
//  - bg.png (or jpg): This will be the Background
//
// It will also try to load the 'prstyle' file
// if it exists
function loadSlide(id) {
    // Update current slide number
    _slideNum = id;

    // Get TXT File
    fetch("presentation/"+id+"/data.txt")
    .then((res) => {
        if (res.ok) {
            return res.text();
        }
        throw new Error("No Data");
    })
    .then((text) => {
        console.log(text);
        // If the file is found write its contents
        // to the slide
        writeToSlide(text);
    })
    .catch((e) => {
        writeToSlide("TITLE:  ");
        // If this slide gives error, it's the end of the presentation
        _maxSlide = id;
    });

    // Get Image
    document.body.style.backgroundImage="url('presentation/"+id+"/bg.png')";
    console.log("presentation/"+id+"/bg.png");

    // Get prstyle
    fetch("presentation/"+id+"/prstyle")
    .then((res) => {
        if (res.ok) {
            return res.text();
        }
        throw new Error("No Data");
    })
    .then((text) => {
        console.log("found a prstyle");
        loadSlideStyle(text);
    })
    .catch((e) => console.log("prstyle not found"));
}

// Write to the HTML Elements
function writeToSlide(text) {
    // TITLE
    const titleElem = document.getElementById("title");
    // get title and update text to only contain body
    var title = "ERROR!";
    
    var lines = text.split('\n');
    if (lines[0].substring(0, 7) == "TITLE: ") {
        title = lines[0].substring(7);
    }

    titleElem.innerHTML = title;

    // DIV
    const div = document.getElementById("slidediv");

    // First we remove the previous contents of the div
    while (div.hasChildNodes()) {
        div.removeChild(div.firstChild);
    }

    // DOOM
    // Is the title "DOOM"?
    // If yes, load the DOOM game and return
    if (title == "DOOM") {
        doom();
        return;
    }
    if (ci != null) {
        deleteDoom();
    }

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

    // we start from 2 because first one is title and second one is empty
    for (let i = 2; i < lines.length; i++) {
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
                div.appendChild(node);
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
            div.appendChild(node);
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
            div.appendChild(node);
        }
    }
}

// Write styles
function loadSlideStyle(text) {
    var lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        var variable = line.substring(0, 5);
        var value = line.substring(5);
        console.log(variable+value);
        if (variable == "tcol=") {
            const titleElem = document.getElementById("title");
            titleElem.style.color = value;
        }
        else if (variable == "bcol=") {
            document.body.style.color = value;
        }
    }
}

// DOOM
async function doom() {
    // Create doomdiv
    var div = document.createElement("div");
    div.setAttribute("id", "doomdiv");
    div.setAttribute("class", "doomdiv");

    document.getElementById("slidediv").appendChild(div);

    emulators.pathPrefix = "js-dos/";

    ci = await Dos(document.getElementById("doomdiv"), {
        style: "none",
        noSideBar: true,
        noFullscreen: true,
        noSocialLinks: true
    })
        .run("https://cdn.dos.zone/custom/dos/doom.jsdos");
}
function deleteDoom() {
    ci.exit();
    ci = null;

    var stuff1 =document.getElementsByClassName("notyf")[0];
    for (let i = 0; i < stuff1.length; i++) {
        stuff1[i].remove();
    }
    var stuff2 = document.getElementsByClassName("notyf-announcer")[0];
    for (let i = 0; i < stuff2.length; i++) {
        stuff2[i].remove();
    }
}