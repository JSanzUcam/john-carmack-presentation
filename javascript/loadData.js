// Number of Slide + Change Slide with arrow keys
var ci = null;
window.addEventListener('keydown', event => {
    if (event.key == "ArrowLeft") {
        if (jsp_slideNum > 0) {
            loadSlide(jsp_slideNum-1);
        }
    } else if (event.key == "ArrowRight") {
        if (jsp_slideNum < jsp_maxSlide) {
            loadSlide(jsp_slideNum+1);
        }
    }
})

// Load Cover of presentation, just loads the first slide
// The first slide is slide 0
function loadTitle() {
    loadSlide(jsp_slideNum);
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
    jsp_slideNum = id;

    // Get TXT File
    fetch("presentation/"+id+"/data.txt")
    .then((res) => {
        if (res.ok) {
            return res.text();
        }
        throw new Error("No Data");
    })
    .then((text) => {
        // console.log(text);
        // If the file is found write its contents
        // to the slide
        interpretDataFile(text);
    })
    .catch((e) => {
        interpretDataFile("TITLE:  ");
        // If this slide gives error, it's the end of the presentation
        jsp_maxSlide = id;
    });

    // Get Image
    editBG("presentation/"+id+"/bg.png");
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
function interpretDataFile(text) {
    // TITLE
    // get title and update text to only contain body
    var title = "ERROR!";
    
    var lines = text.split('\n');
    if (lines[0].substring(0, 7) == "TITLE: ") {
        title = lines[0].substring(7);
    }

    updateTitle(title);

    // Body Text into a single string
    var bodyText = "";
    for (let i = 2; i < lines.length; i++) {
        bodyText += lines[i] + "\n";
    }
    bodyText = bodyText.substring(0, bodyText.length - 1);
    console.log(bodyText);

    // Load body text into a single string
    loadBodyFromText(bodyText, title);
}

// Load Body from text
// Used by writeToSlide() and editor.js
function loadBodyFromText(bodyText, title) {
    // Remove Contents of Div
    cleanDiv();

    // DOOM
    // Is the title "DOOM"?
    // If yes, load the DOOM game and return
    if (title == "DOOM") {
        console.log("IT'S DOOMIN' TIME!!");
        doom();
        return;
    }
    if (ci != null) {
        deleteDoom();
    }

    // Update the div if we don't play DOOM
    updateDiv(bodyText);
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
            editTitleColor(value);
        }
        else if (variable == "bcol=") {
            editBodyColor(value);
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

    var stuff1 =document.getElementsByClassName("notyf");
    for (let i = 0; i < stuff1.length; i++) {
        stuff1[i].remove();
    }
    var stuff2 = document.getElementsByClassName("notyf-announcer");
    for (let i = 0; i < stuff2.length; i++) {
        stuff2[i].remove();
    }
}