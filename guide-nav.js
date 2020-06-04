var currentPage = 0
var pageContent = [
    "Hi! Welcome to Culors!<br/><br/>This guide will walk you through the basics of the game.",
    "When you enter a match, you are assigned a color;<br/><b><span class=\"red-text\">Red</span></b> or <b><span class=\"blue-text\">Blue</span></b>. <b><span class=\"red-text\">Red</span></b> always starts.",
    "By clicking a tile, you fill that tile with your assigned color, as well as the 4 surrounding tiles. The middle tile is disabled during the first two rounds.",
    "Your goal is to eliminate all opposing color tiles.",
    "Filling tiles during a round will disable those tiles for the opponent during the next round. Disabled tiles can not be directly clicked on, but can still be filled by the 4 \"surrounding\" tiles. Disabled tiles are marked with <i class=\"fa fa-ban\" aria-hidden=\"true\"></i>.",
    "If you go into a round while having the <i>least</i> amount of colored tiles, you must place a <b><span class=\"yellow-text\">blocker</span></b> tile before placing your color tiles.",
    "The <b><span class=\"yellow-text\">blocker</span></b> tile can be placed <i>anywhere</i> (except on another blocker), even on a disabled tile. Blockers only fill the clicked tile, not the surrounding tiles. Blockers can never become disabled.",
    "The <b><span class=\"yellow-text\">blocker</span></b> tile prevents red and blue color from filling it, unless the color is placed directly on it.",
    "By placing your color directly on a <b><span class=\"yellow-text\">blocker</span></b> tile, that tile and all <i>connected</i> blocker tiles will be filled with your color. Doing this will <i>not</i> disable those tiles for the opponent during the next round.",
    "That's it! Press Play to begin!"
]
var currentAnimTimeouts = []
var currentAnimIntervals = []

document.addEventListener("DOMContentLoaded", function(event){
    scaleGuide()
    scaleBoard()
    scaleWinAlert()
    window.addEventListener("resize", function(event){
        scaleGuide()
        scaleBoard()
        scaleWinAlert()
    })
    if(localStorage.getItem("guide") == null){
        document.getElementById("opponent-wait-animation").style.visibility = "hidden"
        document.getElementById("guide").style.display = "inherit"
        document.getElementById("overlay").style.display = "inherit"
    }
    handleNextButtonClick()
    handlePreviousButtonClick()
    handleCrossClick()
})

const scaleWinAlert = function(){
    var numToCompare = 0
    if(window.innerWidth <= window.innerHeight){
        numToCompare = window.innerWidth
    }
    else {
        numToCompare = window.innerHeight
    }
    if(numToCompare < 600){
        const scale = (numToCompare / 550) * 1.15
        document.getElementById("win-alert").style.transform = "scale(" + scale.toString() + ")"
    }
    else {
        document.getElementById("win-alert").style.transform = "scale(1)"
    }
}

const scaleGuide = function(){
    var numToCompare = 0
    if(window.innerWidth <= window.innerHeight){
        numToCompare = window.innerWidth
    }
    else {
        numToCompare = window.innerHeight
    }
    if(numToCompare < 600){
        const scale = (numToCompare / 550) * 0.98
        document.getElementById("guide").style.transform = "scale(" + scale.toString() + ")"
        document.getElementById("guide-text").style.fontSize = "20px"
    }
    else {
        document.getElementById("guide").style.transform = "scale(1)"
    }
}

const scaleBoard = function(){
    const boardWidth = window.innerWidth * 0.3064
    var scale = 1
    if(window.innerWidth <= 600){
        scale = 2
        if(window.innerWidth <= 375){
            scale = 2.18
        }
    }
    if((boardWidth * scale) > (window.innerHeight - 180)){
        scale = ((window.innerHeight - 180) / (boardWidth))
    }
    document.getElementById("board").style.transform = "scale(" + scale + ")"
    document.getElementById("board").style.top = "calc(50% - " + (5 * scale) + "vw)"
    document.getElementById("board").style.left = "calc(50% - " + (5 * scale) + "vw)"
}

const handleCrossClick = function(){
    document.getElementById("cross-click").addEventListener("click", function(event){
        if(localStorage.getItem("guide") == null){
            localStorage.setItem("guide", "seen")
            setUpOpponentWaiter()
        }
        document.getElementById("guide").style.display = "none"
        document.getElementById("overlay").style.display = "none"
        document.getElementById("opponent-wait-animation").style.visibility = "inherit"
    })
    document.getElementById("guide-button").addEventListener("click", function(event){
        document.getElementById("guide").style.display = "inherit"
        document.getElementById("overlay").style.display = "inherit"
    })
}

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
    resetAnims()
    if(currentPage == 2){
        startPage2Anim()
    }
    else if(currentPage == 3){
        startPage3Anim()
    }
    else if(currentPage == 4){
        startPage4Anim()
    }
    else if(currentPage == 5){
        startPage5Anim()
    }
    else if(currentPage == 6){
        startPage6Anim()
    }
    else if(currentPage == 7){
        startPage7Anim()
    }
    else if(currentPage == 8){
        startPage8Anim()
    }
    else if(currentPage == 9){
        showPlayButton()
    }
}

const showPlayButton = function(){
    var guideCircles = document.getElementsByClassName("guide-circle")

    for(var i = 0; i < guideCircles.length; i++){
        guideCircles[i].style.visibility = "hidden"
    }

    var selectedColor = ""
    if(Math.random() > 0.5){
        selectedColor = "#F01C17"
    }
    else{
        selectedColor = "#002AA2"
    }

    document.getElementById("play-button").style.visibility = "inherit"
    document.getElementById("play-button").addEventListener("mouseenter", function(event){
        document.getElementById("play-button").style.borderColor = selectedColor
        document.getElementById("play-button-text").style.color = selectedColor
    })
    document.getElementById("play-button").addEventListener("mouseleave", function(event){
        document.getElementById("play-button").style.borderColor = "lightgrey"
        document.getElementById("play-button-text").style.color = "lightgrey"
    })
    document.getElementById("play-button").addEventListener("click", function(event){
        if(localStorage.getItem("guide") == null){
            localStorage.setItem("guide", "seen")
            setUpOpponentWaiter()
        }
        document.getElementById("opponent-wait-animation").style.visibility = "inherit"
        document.getElementById("guide").style.display = "none"
        document.getElementById("overlay").style.display = "none"
    })
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

const startPage2Anim = function(){
    const cursor = document.getElementById("cursor-red")
    setTilesToColor([1, 2, 3, 4, 5, 6, 7, 8, 9], "O")
    const anim = function(){
        currentAnimTimeouts.push(setTimeout(function(){
            cursor.classList.remove("page-1-mid")
            cursor.classList.remove("page-1-right")
            cursor.classList.remove("page-1-top")
            void cursor.offsetWidth
            cursor.classList.add("page-1-mid")
            fadeInTiles([2, 4, 5, 6, 8], "R")
        }, 1500))
        currentAnimTimeouts.push(setTimeout(function(){
            cursor.classList.remove("page-1-mid")
            cursor.classList.remove("page-1-right")
            cursor.classList.remove("page-1-top")
            void cursor.offsetWidth
            cursor.classList.add("page-1-right")
            fadeInTiles([3, 5, 6, 9], "R")
        }, 5000))
        currentAnimTimeouts.push(setTimeout(function(){
            cursor.classList.remove("page-1-mid")
            cursor.classList.remove("page-1-right")
            cursor.classList.remove("page-1-top")
            void cursor.offsetWidth
            cursor.classList.add("page-1-top")
            fadeInTiles([2, 3, 6], "R")
        }, 8500))
    }
    anim()
    currentAnimIntervals.push(setInterval(function(){
        anim()
    }, 12000))
}

const startPage3Anim = function(){
    const cursor = document.getElementById("cursor-red")
    setTilesToColor([3, 7, 9], "R")
    setTilesToColor([2, 5, 6, 8], "B")
    setTilesToColor([1, 4], "Y")
    const anim = function(){
        currentAnimTimeouts.push(setTimeout(function(){
            cursor.classList.remove("page-1-mid")
            cursor.classList.remove("page-1-right")
            cursor.classList.remove("page-1-top")
            void cursor.offsetWidth
            cursor.classList.add("page-1-mid")
            fadeInTiles([2, 5, 6, 8], "BR")
        }, 1500))
    }
    anim()
    currentAnimIntervals.push(setInterval(function(){
        anim()
    }, 5000))
}

const startPage4Anim = function(){
    const cursor = document.getElementById("cursor-red")
    const blueCursor = document.getElementById("cursor-blue")
    setTilesToColor([1], "R")
    setTilesToColor([2, 3, 4, 5, 6, 7, 8, 9], "B")
    const anim = function(){
        currentAnimTimeouts.push(setTimeout(function(){
            cursor.classList.remove("page-1-mid")
            cursor.classList.remove("page-1-right")
            cursor.classList.remove("page-1-top")
            void cursor.offsetWidth
            cursor.classList.add("page-1-right")
            fadeInTiles([3, 5, 6, 9], "BRS")
            fadeInTiles([1], "ban")
        }, 1500))
        currentAnimTimeouts.push(setTimeout(function(){
            blueCursor.classList.remove("page-1-mid")
            blueCursor.classList.remove("page-1-right")
            blueCursor.classList.remove("page-1-top")
            void blueCursor.offsetWidth
            blueCursor.classList.add("page-1-mid")
            fadeInTiles([3, 5, 6, 9], "RBS")
        }, 5000))
    }
    anim()
    currentAnimIntervals.push(setInterval(function(){
        anim()
    }, 8500))
}

const startPage5Anim = function(){
    const cursor = document.getElementById("cursor-red")
    setTilesToColor([1], "R")
    setTilesToColor([2, 3, 4, 5, 6, 7, 8, 9], "B")
    const anim = function(){
        currentAnimTimeouts.push(setTimeout(function(){
            cursor.classList.remove("page-1-mid")
            cursor.classList.remove("page-1-right")
            cursor.classList.remove("page-1-top")
            void cursor.offsetWidth
            cursor.classList.add("page-1-mid")
            fadeInTiles([5], "Y")
        }, 1500))
    }
    anim()
    currentAnimIntervals.push(setInterval(function(){
        anim()
    }, 5000))
}

const startPage6Anim = function(){
    document.getElementById("guide-ban-icon1").style.opacity = "1"
    document.getElementById("guide-ban-icon2").style.opacity = "1"
    document.getElementById("guide-ban-icon3").style.opacity = "1"
    document.getElementById("guide-ban-icon4").style.opacity = "1"

    const cursor = document.getElementById("cursor-red")
    setTilesToColor([1], "R")
    setTilesToColor([2, 3, 4, 5, 6, 7, 8, 9], "B")
    const anim = function(){
        currentAnimTimeouts.push(setTimeout(function(){
            cursor.classList.remove("page-1-mid")
            cursor.classList.remove("page-1-right")
            cursor.classList.remove("page-1-top")
            void cursor.offsetWidth
            document.getElementById("guide-ban-icon2").classList.remove("yellow-ban-special")
            void document.getElementById("guide-ban-icon2").offsetWidth
            document.getElementById("guide-ban-icon2").classList.add("yellow-ban-special")
            cursor.classList.add("page-1-right")
            fadeInTiles([6], "Y")
        }, 1500))
    }
    anim()
    currentAnimIntervals.push(setInterval(function(){
        anim()
    }, 5000))
}

const startPage7Anim = function(){
    const cursor = document.getElementById("cursor-red")
    setTilesToColor([4, 7], "R")
    setTilesToColor([2, 3, 6], "B")
    setTilesToColor([1, 5, 8, 9], "Y")
    const anim = function(){
        currentAnimTimeouts.push(setTimeout(function(){
            cursor.classList.remove("page-1-mid")
            cursor.classList.remove("page-1-right")
            cursor.classList.remove("page-1-top")
            void cursor.offsetWidth
            cursor.classList.add("page-1-right")
            fadeInTiles([3, 6], "BR")
        }, 1500))
    }
    anim()
    currentAnimIntervals.push(setInterval(function(){
        anim()
    }, 5000))
}

const startPage8Anim = function(){
    const cursor = document.getElementById("cursor-red")
    setTilesToColor([4, 7], "R")
    setTilesToColor([2, 3, 6], "B")
    setTilesToColor([1, 5, 8, 9], "Y")
    const anim = function(){
        currentAnimTimeouts.push(setTimeout(function(){
            cursor.classList.remove("page-1-mid")
            cursor.classList.remove("page-1-right")
            cursor.classList.remove("page-1-top")
            void cursor.offsetWidth
            cursor.classList.add("page-1-mid")
            fadeInTiles([5, 8, 9], "RY")
        }, 1500))
    }
    anim()
    currentAnimIntervals.push(setInterval(function(){
        anim()
    }, 5000))
}

const fadeInTiles = function(tiles, color){
    for(let i = 0; i < tiles.length; i++){
        if(color == "R"){
            document.getElementById("guide-tile" + tiles[i].toString()).classList.remove("red-fade")
            void document.getElementById("guide-tile" + tiles[i].toString()).offsetWidth
            document.getElementById("guide-tile" + tiles[i].toString()).classList.add("red-fade")
        }
        else if(color == "BRS"){
            document.getElementById("guide-tile" + tiles[i].toString()).style.backgroundColor = "#002AA2"
            document.getElementById("guide-tile" + tiles[i].toString()).classList.remove("bluetored-fade-stick")
            document.getElementById("guide-tile" + tiles[i].toString()).classList.remove("redtoblue-fade-stick")
            void document.getElementById("guide-tile" + tiles[i].toString()).offsetWidth
            document.getElementById("guide-tile" + tiles[i].toString()).classList.add("bluetored-fade-stick")
        }
        else if(color == "RBS"){
            document.getElementById("guide-tile" + tiles[i].toString()).style.backgroundColor = "#F01C17"
            document.getElementById("guide-tile" + tiles[i].toString()).classList.remove("redtoblue-fade-stick")
            void document.getElementById("guide-tile" + tiles[i].toString()).offsetWidth
            document.getElementById("guide-tile" + tiles[i].toString()).classList.add("redtoblue-fade-stick")
        }
        else if(color == "B"){
            document.getElementById("guide-tile" + tiles[i].toString()).classList.remove("blue-fade")
            void document.getElementById("guide-tile" + tiles[i].toString()).offsetWidth
            document.getElementById("guide-tile" + tiles[i].toString()).classList.add("blue-fade")
        }
        else if(color == "BR"){
            document.getElementById("guide-tile" + tiles[i].toString()).classList.remove("bluetored-fade")
            void document.getElementById("guide-tile" + tiles[i].toString()).offsetWidth
            document.getElementById("guide-tile" + tiles[i].toString()).classList.add("bluetored-fade")
        }
        else if(color == "RY"){
            document.getElementById("guide-tile" + tiles[i].toString()).classList.remove("yellow-fade-red")
            void document.getElementById("guide-tile" + tiles[i].toString()).offsetWidth
            document.getElementById("guide-tile" + tiles[i].toString()).classList.add("yellow-fade-red")
        }
        else if(color == "Y"){
            document.getElementById("guide-tile" + tiles[i].toString()).classList.remove("yellow-fade")
            void document.getElementById("guide-tile" + tiles[i].toString()).offsetWidth
            document.getElementById("guide-tile" + tiles[i].toString()).classList.add("yellow-fade")
        }
        else if(color == "ban"){
            document.getElementById("guide-ban-icon1").classList.remove("guide-ban-icon-fade-in-pulsate")
            void document.getElementById("guide-ban-icon1").offsetWidth
            document.getElementById("guide-ban-icon1").classList.add("guide-ban-icon-fade-in-pulsate")

            document.getElementById("guide-ban-icon2").classList.remove("guide-ban-icon-fade-in")
            void document.getElementById("guide-ban-icon2").offsetWidth
            document.getElementById("guide-ban-icon2").classList.add("guide-ban-icon-fade-in")

            document.getElementById("guide-ban-icon3").classList.remove("guide-ban-icon-fade-in")
            void document.getElementById("guide-ban-icon3").offsetWidth
            document.getElementById("guide-ban-icon3").classList.add("guide-ban-icon-fade-in")

            document.getElementById("guide-ban-icon4").classList.remove("guide-ban-icon-fade-in")
            void document.getElementById("guide-ban-icon4").offsetWidth
            document.getElementById("guide-ban-icon4").classList.add("guide-ban-icon-fade-in")
        }
    }
}

const setTilesToColor = function(tiles, color){
    for(let i = 0; i < tiles.length; i++){
        if(color == "R"){
            document.getElementById("guide-tile" + tiles[i].toString()).style.backgroundColor = "#F01C17"
        }
        else if(color == "B"){
            document.getElementById("guide-tile" + tiles[i].toString()).style.backgroundColor = "#002AA2"
        }
        else if(color == "Y"){
            document.getElementById("guide-tile" + tiles[i].toString()).style.backgroundColor = "#F4E620"
        }
        else if(color == "O"){
            document.getElementById("guide-tile" + tiles[i].toString()).style.backgroundColor = "lightgrey"
        }
    }
}

const resetAnims = function(){
    document.getElementById("play-button").style.visibility = "hidden"
    var guideCircles = document.getElementsByClassName("guide-circle")

    for(var i = 0; i < guideCircles.length; i++){
        guideCircles[i].style.visibility = "inherit"
    }

    document.getElementById("guide-ban-icon1").style.opacity = "0"
    document.getElementById("guide-ban-icon2").style.opacity = "0"
    document.getElementById("guide-ban-icon3").style.opacity = "0"
    document.getElementById("guide-ban-icon4").style.opacity = "0"

    for(let i = 1; i <= 9; i++){
        document.getElementById("guide-tile" + i.toString()).classList.remove("red-fade")
        document.getElementById("guide-tile" + i.toString()).classList.remove("blue-fade")
        document.getElementById("guide-tile" + i.toString()).classList.remove("yellow-fade")
        document.getElementById("guide-tile" + i.toString()).classList.remove("yellow-fade-red")
        document.getElementById("guide-tile" + i.toString()).classList.remove("bluetored-fade")
        document.getElementById("guide-tile" + i.toString()).classList.remove("bluetored-fade-stick")
        document.getElementById("guide-tile" + i.toString()).classList.remove("redtoblue-fade-stick")
        void document.getElementById("guide-tile" + i.toString()).offsetWidth
    }
    while(currentAnimTimeouts.length > 0){
        var timeout = currentAnimTimeouts.pop()
        clearTimeout(timeout)
    }
    while(currentAnimIntervals.length > 0){
        var interval = currentAnimIntervals.pop()
        clearInterval(interval)
    }
    var redCursor = document.getElementById("cursor-red")
    redCursor.classList.remove("page-1-mid")
    redCursor.classList.remove("page-1-right")
    redCursor.classList.remove("page-1-top")
    void redCursor.offsetWidth
    redCursor.style.opacity = "0"
    
    var blueCursor = document.getElementById("cursor-blue")
    blueCursor.classList.remove("page-1-mid")
    blueCursor.classList.remove("page-1-right")
    blueCursor.classList.remove("page-1-top")
    void blueCursor.offsetWidth
    blueCursor.style.opacity = "0"

    document.getElementById("guide-ban-icon1").classList.remove("guide-ban-icon-fade-in-pulsate")
    void document.getElementById("guide-ban-icon1").offsetWidth

    document.getElementById("guide-ban-icon2").classList.remove("guide-ban-icon-fade-in")
    document.getElementById("guide-ban-icon2").classList.remove("yellow-ban-special")
    void document.getElementById("guide-ban-icon2").offsetWidth

    document.getElementById("guide-ban-icon3").classList.remove("guide-ban-icon-fade-in")
    void document.getElementById("guide-ban-icon3").offsetWidth

    document.getElementById("guide-ban-icon4").classList.remove("guide-ban-icon-fade-in")
    void document.getElementById("guide-ban-icon4").offsetWidth
}