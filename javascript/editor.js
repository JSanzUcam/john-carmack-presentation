// Change Wallpaper
// ----------------
var bgreader = new FileReader();
// Loads Background
bgreader.addEventListener('load', e => {
    editBG(e.target.result);
    console.log("CHANGED BG MANUALLY!");
});

// Change Colors
// -------------
window.addEventListener("load", () => {
    // Form Callback for Background
    document.forms.pickfile.file.addEventListener('change', e => {
        bgreader.readAsDataURL(e.target.files[0]);
    });
    // Form Callback for ZIP FILE LOADING
    document.forms.pickfile.ziploading.addEventListener('change', e => {
        loadSlideZIP(document.forms.pickfile.ziploading.files[0]);
    });
    // Callback for Color 1
    var colort = document.getElementById("colort");
    colort.addEventListener("input", e => {
        editTitleColor(e.target.value);
    }, false);
    // Callback for Color 2
    var colorb = document.getElementById("colorb");
    colorb.addEventListener("input", e => {
        editBodyColor(e.target.value);
    }, false);
}, false);

// Edit tools (keybinds)
// ---------------------
window.addEventListener('keydown', async event => {
    // Change Title Text
    if (event.ctrlKey && event.key == JSP_CHANGE_TITLE) {
        event.preventDefault();

        let title = document.getElementById("title");
        
        let newText = prompt("Enter the new Title", title.innerHTML);
        if (newText == "") {
            return;
        }

        // Update the title
        updateTitle(newText);
    }
    // Change Body Text
    if (event.ctrlKey && event.key == JSP_CHANGE_BODY) {
        event.preventDefault();
        
        var newText = "";
        var input = "not empty lmao";
        var index = 0;
        while (input != "") {
            index++;
            input = prompt("Enter line "+ index +" (leave empty to stop)");
            newText += input + "\n";
        }

        // Update the text
        loadBodyFromText(newText);
    }
    // Show Editor Controls
    if (event.ctrlKey && event.code == "Space") {
        event.preventDefault();

        var editorDiv = document.getElementById("editorDiv");
        if (editorDiv.style.display === "none") {
            editorDiv.style.display = "block";
        } else {
            editorDiv.style.display = "none";
        }
    }
    // Save files
    if (event.ctrlKey && event.key == JSP_SAVE_TO_FILE) {
        event.preventDefault();

        // TEST CRAP
        var zip = new JSZip();

        // data.txt
        zip.file("data.txt", 
            "TITLE: " + jsp_titleText + "\n\n" +
            jsp_bodyText
        );
        // prstyle
        zip.file("prstyle", 
            "tcol=" + jsp_titleStyle + "\n" +
            "bcol=" + jsp_bodyStyle
        );
        // bg.png
        const imageBlob = await fetch(jsp_bgURL).then(response => response.blob());
        const imageFile = new File([imageBlob], "bg.png");
        zip.file("bg.png", 
            imageFile
        );

        // Save
        zip.generateAsync({type:"blob"})
        .then(function(content) {
            // see FileSaver.js
            saveAs(content, "slide.jsp");
        });
    }
    // Load Files
});