var currentPage = 0
var pageContent = [
    "Hi! Welcome to Culors!<br/><br/>This guide will walk you through the basics of the game.",
    "When you enter a match, you are assigned a color;<br/><b><span class=\"red-text\">Red</span></b> or <b><span class=\"blue-text\">Blue</span></b>. <b><span class=\"red-text\">Red</span></b> always starts.",
    "By clicking a tile, you fill that tile with your assigned color, as well as the 4 surrounding tiles. The middle tile is disabled during the first two rounds.",
    "Your goal is to eliminate all opposing color tiles.",
    "Filling tiles during a round will disable those tiles for the opponent during the next round. Disabled tiles can not be clicked on. Disabled tiles are marked with <i class=\"fa fa-ban\" aria-hidden=\"true\"></i>.",
    "If you have the <i>least</i> amount of colored tiles, you get to place a <b><span class=\"yellow-text\">blocker</span></b> tile before placing your color tiles.",
    "The <b><span class=\"yellow-text\">blocker</span></b> tile can be placed <i>anywhere</i>, even on a disabled tile. Placing a blocker only fills the clicked tile, not the surrounding tiles.",
    "The <b><span class=\"yellow-text\">blocker</span></b> tile prevents red and blue color from filling it, unless the color is placed directly on it.",
    "By placing your color directly on a <b><span class=\"yellow-text\">blocker</span></b> tile, that tile and all <i>connected</i> blocker tiles will be filled with your color. Doing this will <i>not</i> disable those tiles for the opponent during the next round.",
    "That's it! Press Play to begin!"
]

document.addEventListener("DOMContentLoaded", function(event){
    handleNextButtonClick()
    handlePreviousButtonClick()
})

const handleNextButtonClick = function(){
    document.getElementById("guide-next-button").addEventListener("click", function(event){
        if(currentPage < 9){
            currentPage = currentPage + 1
            handleCurrentPage()
        }
    })
}

const handlePreviousButtonClick = function(){
    document.getElementById("guide-previous-button").addEventListener("click", function(event){
        if(currentPage > 0){
            currentPage = currentPage - 1
            handleCurrentPage()
        }
    })
}

const handleCurrentPage = function(){
    document.getElementById("guide-text").innerHTML = pageContent[currentPage]
    updateGuideCircles()
}

const updateGuideCircles = function(){
    if(currentPage == 0){
        document.getElementById("guide-circle-2").style.backgroundColor = "#e0e0e0"
    }
    for(let i = 0; i <= 9; i++){
        if(i != 0){
            if(currentPage >= i){
                document.getElementById("guide-circle-" + (i + 1).toString()).style.backgroundColor = "#a8a8a8"
            }
            else{
                document.getElementById("guide-circle-" + (i + 1).toString()).style.backgroundColor = "#e0e0e0"
            }
        }
    }
}