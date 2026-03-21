class Directory {
    name = "";
    parent = undefined;
    subDirectories = [];
    containedFiles = [];

    static asRoot(name, subDirectories, containedFiles){
           return new Directory(name, undefined, subDirectories, containedFiles);
    }

    constructor(name, parent, subDirectories, containedFiles){
        this.name = name;
        this.parent = parent;
        this.subDirectories = subDirectories;
        this.containedFiles = containedFiles;
    }

    addSubdirectory(subdirectory){
        this.subDirectories.push(subdirectory);
    }

}

class File {
    name = "";
    content = "";
    type = "";
    constructor(name, content, type) {
        this.name = name;
        this.content = content;
        this.type = type;
   }

   toString() {
        return this.name+this.type
   }
}

const commandHistory = [];
var historySelection = 0;
var historyFirstUse = true;
var currentDirectory = Directory.asRoot("~", [], [new File("The-Softlove-Skeleton", "The Softlove Skeleton is a senior DevOps developer located in ████████. They graduated with a Master of Engineering at the university of █████████.", ".txt")])
const projectDirectory = new Directory("Projects", currentDirectory, [], [])
currentDirectory.addSubdirectory(projectDirectory);

window.onload = function() {
    var cursorInput = document.getElementById("cursor-input")
    cursorInput.addEventListener("keydown", function(e){
        if(e.code === "Enter"){
            var input = cursorInput.value;
            inputSubmitted(input);
            cursorInput.value = "";
            commandHistory.push(input);
            resetCommandHistorySelection();
        }else if(e.code === "ArrowUp"){
            setCommandHistoryEntry(cursorInput, e.code);
        }else if(e.code === "ArrowDown"){
            setCommandHistoryEntry(cursorInput, e.code);
        }
    })

    cursorInput.onblur = function(){
        cursorInput.focus()
    }

}

function setCommandHistoryEntry(cursorInput, code){
    var selectedCommand = commandHistory[historySelection];
    if(selectedCommand){
        cursorInput.value = selectedCommand;
        if(!historyFirstUse){
            if( code === "ArrowUp"){
                historySelection--;
                historySelection= Math.max(historySelection, 0);
            }else{
                historySelection++;
                historySelection = Math.min(historySelection, commandHistory.length-1);
            }
        }
    }
    historyFirstUse = false;
}


function resetCommandHistorySelection(){
    historySelection = commandHistory.length -1;
    historyFirstUse = true;
}

function inputSubmitted(input){
    console.log(input)
    var outputArea = document.getElementById("output-area")
    outputArea.innerHTML = ""
     if(input === "ls"){
        var directoryOutput ="";
        for (let subdirectory of currentDirectory.subDirectories) {
            directoryOutput +=  "<u>" + subdirectory.name + "</u>";
            directoryOutput += "<br>";
        }
        for (let file of currentDirectory.containedFiles) {
            directoryOutput += file.toString();
            directoryOutput += "<br>";
        }
        outputArea.innerHTML = directoryOutput;
     }else if(input.toLowerCase().startsWith("cd")){
        var splitInput = input.split(" ").filter(str => str);
        var requestedDirectory = splitInput[1];
        if(requestedDirectory === ".."){
            currentDirectory = currentDirectory.parent ? currentDirectory.parent : currentDirectory;
        }else{
            for(let directory of currentDirectory.subDirectories){
                if(directory.name === requestedDirectory){
                    currentDirectory = directory;
                    return;
                }
            }
            // No Directory found
            outputArea.innerHTML = "Not a valid directory "+ "'"+requestedDirectory+"'"
        }
     } else if(input.toLowerCase().startsWith("cat")){
        var selectedFile = input.split(" ").filter(str => str)[1];
        for( file of currentDirectory.containedFiles){
            if(file.toString() === selectedFile){
                outputArea.innerHTML = file.content;
                return;
            }
        }
        // No Directory found
        outputArea.innerHTML = "Not a valid file "+ "'"+selectedFile+"'"
     }else if(input === "help"){
        outputArea.innerHTML += "<pre>";
        outputArea.innerHTML += "The following commands are available: <br>";
        outputArea.innerHTML += "help                   - Displays all command <br>";
        outputArea.innerHTML += "ls                     - Lists all files and directories in the current directory <br>";
        outputArea.innerHTML += "cd [directory path]    - Changed the current directory to the directory described by the given path <br>";
        outputArea.innerHTML += "cat [file name]        - Displays the content of the file selected by file name <br>";
        outputArea.innerHTML += "</pre>";

     }else{
        outputArea.innerHTML = "Invalid input command: "+ "'"+input+"'"
     }
}