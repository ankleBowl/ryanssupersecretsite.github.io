// Server side functions
function getURL(url) {
    // get the contents of the url
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function postURL(url, data) {
    // post the data to the url
    console.log("Posting to " + url + " with data " + data);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "text/plain");
    xhttp.send(data);
    return xhttp.responseText;
}

function sessionIsValid(id) {
    // make an https request to the server to check if the session ID is valid
    var state = getURL(serverAddress + "checksessionid/" + id)
    if (state == "invalid") {
        return false;
    } else {
        return true;
    }
}

function getNoteList() {
    console.log("Getting note list");
    // make an https request to the server to get the list of notes
    var notes = getURL(serverAddress + sessionID + "/listnotes");
    if (notes == "Invalid token" || notes == "") {
        return [];
    } else {
        return notes.split("|");
    }
}

function getNote(name) {
    // make an https request to the server to get the note
    var note = getURL(serverAddress + sessionID + "/getnote/" + name);
    if (note == "Invalid token" || note == "Note does not exist") {
        return "This note no longer exists";
    } else {
        console.log("Fetched note " + name + " with content " + note);
        return note;
    }
}

function createNote(name) {
    // make an https request to the server to create a note
    var state = getURL(serverAddress + sessionID + "/createnote/" + name);
    if (state == "Invalid token" || state == "Note already exists") {
        return false;
    } else {
        return true;
    }
}

function deleteNote(name) {
    // make an https request to the server to delete a note
    var state = getURL(serverAddress + sessionID + "/deletenote/" + name);
    if (state == "Invalid token" || state == "Note does not exist") {
        return false;
    } else {
        return true;
    }
}

function renameNote(name, newName) {
    // make an https request to the server to rename a note
    var state = getURL(serverAddress + sessionID + "/renamenote/" + name + "/" + newName);
    console.log("Renamed note " + name + " to " + newName + " with state " + state);
    if (state == "Invalid token" || state == "Note does not exist" || state == "Note already exists") {
        return false;
    } else {
        return true;
    }
}

function saveNote(name, currentNoteContents) {
    var state = postURL(serverAddress + sessionID + "/savenote/" + name, currentNoteContents);
    console.log("Saving Note: " + name + " returned " + state);
    if (state == "Invalid token" || state == "Note does not exist") {
        return false;
    } else {
        return true;
    }
}