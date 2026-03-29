class Directory {
    name = "";
    parent = undefined;
    subDirectories = [];
    containedFiles = [];

    static asRoot(name, subDirectories, containedFiles) {
        return new Directory(name, undefined, subDirectories, containedFiles);
    }

    constructor(name, parent, subDirectories, containedFiles) {
        this.name = name;
        this.parent = parent;
        this.subDirectories = subDirectories;
        this.containedFiles = containedFiles;
    }

    addSubdirectory(subdirectory) {
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
        return this.name + this.type
    }
}

const commandHistory = [];
var historySelection = 0;
var historyFirstUse = true;
var currentDirectory = Directory.asRoot("~", [], [new File("The-Softlove-Skeleton", "The Softlove Skeleton is a senior DevOps developer located in ████████. They graduated with a Master of Engineering at the university of █████████. With extensive ██████ in █████████, ██████ ██████ ██████ and ████████████ they provide everything to design new systems and improve old ones.", ".txt")])
const docsDirectory = new Directory("Docs", currentDirectory, [], []);
const itemDirectory = new Directory("Items", docsDirectory, [], [new File("Box", "Some Box", ".txt")]);
const entityDirectory = new Directory("Entities", docsDirectory, [], []);
docsDirectory.addSubdirectory(itemDirectory);
docsDirectory.addSubdirectory(entityDirectory);
currentDirectory.addSubdirectory(docsDirectory);

window.onload = function () {
    const cursorInput = document.getElementById("cursor-input");
    cursorInput.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {
            const input = cursorInput.value;
            inputSubmitted(input);
            cursorInput.value = "";
            commandHistory.push(input);
            resetCommandHistorySelection();
        } else if (e.code === "ArrowUp") {
            setCommandHistoryEntry(cursorInput, e.code);
        } else if (e.code === "ArrowDown") {
            setCommandHistoryEntry(cursorInput, e.code);
        }
    })

    cursorInput.onblur = function () {
        cursorInput.focus()
    }

    const outputArea = document.getElementById("output-area");
    outputArea.innerHTML = `

     ______           ______________________________________________
  .-        -.      /                                               \\
 /            \\    |   Logged in as ███████                       |
|              |   |                                                 |
|,  .-.  .-.  ,|   |                                                 |
| )(__/  \\__)( |  |    Display all available commands using 'help'   |
|/     /\\     \\|  |        __________________________________________/
(_     ^^     _)  |     /
 \\__|IIIIII|__/   |    /
  | \\IIIIII/ |   <___/
   \\        /
    --------
     `
}

function setCommandHistoryEntry(cursorInput, code) {
    const selectedCommand = commandHistory[historySelection];
    if (selectedCommand) {
        cursorInput.value = selectedCommand;
        if (!historyFirstUse) {
            if (code === "ArrowUp") {
                historySelection--;
                historySelection = Math.max(historySelection, 0);
            } else {
                historySelection++;
                historySelection = Math.min(historySelection, commandHistory.length - 1);
            }
        }
    }
    historyFirstUse = false;
}


function resetCommandHistorySelection() {
    historySelection = commandHistory.length - 1;
    historyFirstUse = true;
}

function inputSubmitted(input) {
    const outputArea = document.getElementById("output-area");
    outputArea.innerHTML = ""
    if (input === "ls") {
        let directoryOutput = "";
        for (let subdirectory of currentDirectory.subDirectories) {
            directoryOutput += "<u>" + subdirectory.name + "</u>";
            directoryOutput += "<br>";
        }
        for (let file of currentDirectory.containedFiles) {
            directoryOutput += file.toString();
            directoryOutput += "<br>";
        }
        outputArea.innerHTML = directoryOutput;
    } else if (input.toLowerCase().startsWith("cd")) {
        const splitInput = input.split(" ").filter(str => str);
        const requestedDirectory = splitInput[1];
        if (requestedDirectory === "..") {
            currentDirectory = currentDirectory.parent ? currentDirectory.parent : currentDirectory;
        } else {
            const directoryParts = requestedDirectory.split("\\");
            let directoriesFound = 0
            let foundDirectory = currentDirectory
            for (let directoryPart of directoryParts) {
                for (let directory of foundDirectory.subDirectories) {
                    if (directory.name === directoryPart) {
                        directoriesFound++;
                        foundDirectory = directory
                        break;
                    }
                }
            }
            if (directoriesFound === directoryParts.length) {
                currentDirectory = foundDirectory
                return;
            }
            // No Directory found
            outputArea.innerHTML = "Not a valid directory " + "'" + requestedDirectory + "'"
        }
    } else if (input.toLowerCase().startsWith("cat")) {
        const filePath = input.split(" ").filter(str => str)[1];
        const filePathParts = filePath.split("\\").slice(0, -1).filter(str => str);
        const fileName = filePath.split("\\").at(-1);
        let directoriesFound = 0;
        let foundDirectory = currentDirectory;
        for (let filePathPart of filePathParts) {
            for (let directory of foundDirectory.subDirectories) {
                if (directory.name === filePathPart){
                    foundDirectory = directory;
                    directoriesFound++;L
                    break;
                }
            }
        }
        const foundFile = foundDirectory.containedFiles.find(file => file.toString() === fileName);
        if (directoriesFound === filePathParts.length && foundFile) {
            outputArea.innerHTML = foundFile.content;
            return;
        }

        // No File found
        outputArea.innerHTML = "Not a valid file " + "'" + filePath + "'"
    } else if (input === "help") {
        outputArea.innerHTML += "<pre>";
        outputArea.innerHTML += "The following commands are available: <br>";
        outputArea.innerHTML += "help                   - Displays all command <br>";
        outputArea.innerHTML += "ls                     - Lists all files and directories in the current directory <br>";
        outputArea.innerHTML += "cd [directory path]    - Changed the current directory to the directory described by the given path <br>";
        outputArea.innerHTML += "cat [file name]        - Displays the content of the file selected by file name <br>";
        outputArea.innerHTML += "</pre>";

    } else {
        outputArea.innerHTML = "Invalid input command: " + "'" + input + "'"
    }
}