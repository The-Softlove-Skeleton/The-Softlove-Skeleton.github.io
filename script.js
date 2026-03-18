window.onload = function() {
    var cursorInput = document.getElementById("cursor-input")
    cursorInput.addEventListener("keydown", function(e){
        if(e.code === "Enter"){
            inputSubmitted(cursorInput.value)
            cursorInput.value = ""
        }
    })
    cursorInput.onblur = function(){
        cursorInput.focus()
    }

}

function inputSubmitted(input){
    console.log(input)
    var outputArea = document.getElementById("output-area")
    outputArea.innerHTML = ""
     if(input === "ls"){
        outputArea.innerHTML = "Directory output"
     }else{
        outputArea.innerHTML = "Invalid input command: "+ "'"+input+"'"
     }
}