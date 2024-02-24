// JS Presentation Variables
// -------------------------

// Constants
// ---------

// Keybinds
const JSP_CHANGE_TITLE = "R";
const JSP_CHANGE_BODY  = "T";
const JSP_SAVE_TO_FILE = "S";

// -------------------------

// Variables
// ---------

// Editor
var jsp_titleText  = "";
var jsp_bodyText   = "";
var jsp_titleStyle = "";
var jsp_bodyStyle  = "";
var jsp_bgURL      = "";

// debug
function jsp_debugEditorVars() {
    console.log(
        "jsp_titleText  = " + jsp_titleText + "\n" +
        "jsp_bodyText   = " + jsp_bodyText + "\n" +
        "jsp_titleStyle = " + jsp_titleStyle + "\n" +
        "jsp_bodyStyle  = " + jsp_bodyStyle + "\n" +
        "jsp_bgURL      = " + jsp_bgURL
    );
}

// Slideshow
var jsp_slideNum = 0;
var jsp_maxSlide = 9999999;