var playerTurn = 0
var myColor = ""
var tiles = ["O", "O", "O", "O", "O", "O", "O", "O", "O"]
var canPlaceHere = [true, true, true, true, false, true, true, true, true]
var blockerWasPlaced = false
var redHasPlaced = false
var blueHasPlaced = false
var winner = null
var socket = null
var canClickTile = true
var banIsVisible = false
var blockerWarningIsVisible = false
var disabledWarningIsVisible = false

document.addEventListener("DOMContentLoaded", function(event){
    var validTab = localStorage.getItem("tabTime")
    if(validTab == null){
        validTab = true
    }
    else if(Date.now() > parseInt(validTab)){
        validTab = true
    }
    else{
        validTab = false
    }
    if(localStorage.getItem("guide") != null && validTab){
        setUpValidTabTimer()
        setTimeout(function(){
            setUpOpponentWaiter()
        }, 500)
    }
})

const resetGame = function(){
    playerTurn = 0
    myColor = ""
    tiles = ["O", "O", "O", "O", "O", "O", "O", "O", "O"]
    canPlaceHere = [true, true, true, true, false, true, true, true, true]
    blockerWasPlaced = false
    redHasPlaced = false
    blueHasPlaced = false
    winner = null
    canClickTile = true
    banIsVisible = false
    blockerWarningIsVisible = false
    disabledWarningIsVisible = false
    document.getElementById("turn-pill").style.display = "none"
    document.getElementById("opponent-wait-animation").style.visibility = "inherit"
    document.getElementById("bottombar-text").style.visibility = "inherit"
    setBoardColors()
    hideAllBanIcons()
    setTurnText("Connecting")
}

const setUpValidTabTimer = function(){
    setInterval(function(){
        localStorage.setItem("tabTime", (Date.now() + 1000).toString())
    }, 1000)
    window.addEventListener("beforeunload", function(event){
        localStorage.removeItem("tabTime")
    })
}

const registerAllTileClickEvents = function(){
    for(let i = 1; i <= 9; i++){
        registerTileClickEvent(i)
    }
}

const registerTileClickEvent = function(tileNr){
    document.getElementById("tile" + tileNr.toString()).addEventListener("click", function(event){
        var clickedOnBan = false
        if(!canPlaceHere[tileNr - 1] && banIsVisible && blockerWasPlaced){
            clickedOnBan = true
            if(!disabledWarningIsVisible){
                showThisTileIsDisabled(tileNr)
            }
        }
        if(!blockerWasPlaced && tiles[tileNr - 1] == "Y"){
            clickedOnBan = true
            if(!blockerWarningIsVisible){
                showBlockerAlreadyHere(tileNr)
            }
        }
        if(winner == null && playerTurn == 0 && myColor == "R" && canClickTile && !clickedOnBan
        || winner == null && playerTurn == 1 && myColor == "B" && canClickTile && !clickedOnBan){
            canClickTile = false
            socket.emit("tileClick", tileNr.toString())
        }
    })
}

const showBlockerAlreadyHere = function(tileNr){
    blockerWarningIsVisible = true
    document.getElementById("blocker-warning").style.display = "inherit"

    const icon = document.getElementById("blocker-warning")

    if(tileNr == 1 || tileNr == 2 || tileNr == 3){
        icon.style.marginTop = "calc(-10vw - 0.32vw - 0.735vw - 1.7vw)"
    }
    else if(tileNr == 7 || tileNr == 8 || tileNr == 9){
        icon.style.marginTop = "calc(10vw + 0.32vw - 0.735vw - 1.7vw)"
    }
    else{
        icon.style.marginTop = "calc(-0.735vw - 1.7vw)"
    }

    if(tileNr == 1 || tileNr == 4 || tileNr == 7){
        icon.style.marginLeft = "calc(-10vw - 0.32vw - 0.735vw - 0.15vw)"
    }
    else if(tileNr == 3 || tileNr == 6 || tileNr == 9){
        icon.style.marginLeft = "calc(10vw + 0.32vw + 0.735vw - 1.7vw)"
    }
    else{
        icon.style.marginLeft = "calc(-0.9vw)"
    }

    setTimeout(function(){
        document.getElementById("blocker-warning").style.display = "none"
        blockerWarningIsVisible = false
    }, 4000)
}

const showThisTileIsDisabled = function(tileNr){
    disabledWarningIsVisible = true
    document.getElementById("disabled-warning").style.display = "inherit"

    const icon = document.getElementById("disabled-warning")

    if(tileNr == 1 || tileNr == 2 || tileNr == 3){
        icon.style.marginTop = "calc(-10vw - 0.32vw - 0.735vw - 2.25vw)"
    }
    else if(tileNr == 7 || tileNr == 8 || tileNr == 9){
        icon.style.marginTop = "calc(10vw + 0.32vw - 0.735vw - 2.25vw)"
    }
    else{
        icon.style.marginTop = "calc(-0.735vw - 2.25vw)"
    }

    if(tileNr == 1 || tileNr == 4 || tileNr == 7){
        icon.style.marginLeft = "calc(-10vw - 0.32vw - 0.735vw - 1.05vw)"
    }
    else if(tileNr == 3 || tileNr == 6 || tileNr == 9){
        icon.style.marginLeft = "calc(10vw + 0.32vw + 0.735vw - 2.6vw)"
    }
    else{
        icon.style.marginLeft = "calc(-1.8vw)"
    }

    setTimeout(function(){
        document.getElementById("disabled-warning").style.display = "none"
        disabledWarningIsVisible = false
    }, 4000)
}

const getAmountOfRedTiles = function(){
    var sum = 0

    for(let i = 1; i <= 9; i++){
        if(tiles[i - 1] == "R"){
            sum = sum + 1
        }
    }

    return sum
}

const getAmountOfBlueTiles = function(){
    var sum = 0

    for(let i = 1; i <= 9; i++){
        if(tiles[i - 1] == "B"){
            sum = sum + 1
        }
    }

    return sum
}

const setTurnText = function(message){
    document.getElementById("bottombar-text").innerHTML = message
    document.getElementById("turn-pill-text").innerHTML = message
}

const updateTurnText = function(){
    document.getElementById("turn-pill").style.width = "222px"
    document.getElementById("turn-pill").style.height = "70px"
    document.getElementById("turn-pill-text").style.top = "initial"
    document.getElementById("turn-pill-text").style.marginLeft = "initial"
    if(playerTurn == 0){
        if(getAmountOfRedTiles() < getAmountOfBlueTiles() && redHasPlaced && !blockerWasPlaced){
            if(myColor == "R"){
                setTurnText("Your turn<br/><span class=\"small-pill-text\">blocker</span>")
                document.getElementById("turn-pill").style.backgroundColor = "#F01C17"
                document.getElementById("turn-pill").style.border = "4px solid #F4E620"
                document.getElementById("turn-pill").style.width = "212px"
                document.getElementById("turn-pill").style.height = "62px"
                document.getElementById("turn-pill-text").style.top = "-4px"
                document.getElementById("turn-pill-text").style.marginLeft = "-4px"
            }
            else if(myColor == "B"){
                setTurnText("Opponent's turn<br/><span class=\"small-pill-text\">blocker</span>")
                document.getElementById("turn-pill").style.backgroundColor = "#F01C17"
                document.getElementById("turn-pill").style.border = "4px solid #F4E620"
                document.getElementById("turn-pill").style.width = "212px"
                document.getElementById("turn-pill").style.height = "62px"
                document.getElementById("turn-pill-text").style.top = "-4px"
                document.getElementById("turn-pill-text").style.marginLeft = "-4px"
            }
        }
        else{
            if(myColor == "R"){
                setTurnText("Your turn<br/><span class=\"small-pill-text\">color</span>")
                document.getElementById("turn-pill").style.backgroundColor = "#F01C17"
                document.getElementById("turn-pill").style.border = "none"
            }
            else if(myColor == "B"){
                setTurnText("Opponent's turn<br/><span class=\"small-pill-text\">color</span>")
                document.getElementById("turn-pill").style.backgroundColor = "#F01C17"
                document.getElementById("turn-pill").style.border = "none"
            }
        }
    }
    else if(playerTurn == 1){
        if(getAmountOfBlueTiles() < getAmountOfRedTiles() && blueHasPlaced && !blockerWasPlaced){
            if(myColor == "B"){
                setTurnText("Your turn<br/><span class=\"small-pill-text\">blocker</span>")
                document.getElementById("turn-pill").style.backgroundColor = "#002AA2"
                document.getElementById("turn-pill").style.border = "4px solid #F4E620"
                document.getElementById("turn-pill").style.width = "212px"
                document.getElementById("turn-pill").style.height = "62px"
                document.getElementById("turn-pill-text").style.top = "-4px"
                document.getElementById("turn-pill-text").style.marginLeft = "-4px"
            }
            else if(myColor == "R"){
                setTurnText("Opponent's turn<br/><span class=\"small-pill-text\">blocker</span>")
                document.getElementById("turn-pill").style.backgroundColor = "#002AA2"
                document.getElementById("turn-pill").style.border = "4px solid #F4E620"
                document.getElementById("turn-pill").style.width = "212px"
                document.getElementById("turn-pill").style.height = "62px"
                document.getElementById("turn-pill-text").style.top = "-4px"
                document.getElementById("turn-pill-text").style.marginLeft = "-4px"
            }
        }
        else{
            if(myColor == "B"){
                setTurnText("Your turn<br/><span class=\"small-pill-text\">color</span>")
                document.getElementById("turn-pill").style.backgroundColor = "#002AA2"
                document.getElementById("turn-pill").style.border = "none"
            }
            else if(myColor == "R"){
                setTurnText("Opponent's turn<br/><span class=\"small-pill-text\">color</span>")
                document.getElementById("turn-pill").style.backgroundColor = "#002AA2"
                document.getElementById("turn-pill").style.border = "none"
            }
        }
    }
}

const setBanIconToTile = function(iconNr, tileNr){
    const icon = document.getElementById("ban-icon" + iconNr.toString())
    icon.style.visibility = "initial"
    banIsVisible = true

    if(tileNr == 1 || tileNr == 2 || tileNr == 3){
        icon.style.marginTop = "calc(-10vw - 0.32vw + (5vw - 1.85vw))"
    }
    else if(tileNr == 4 || tileNr == 5 || tileNr == 6){
        icon.style.marginTop = "calc(5vw - 1.85vw)"
    }
    else if(tileNr == 7 || tileNr == 8 || tileNr == 9){
        icon.style.marginTop = "calc(10vw + 0.32vw + (5vw - 1.85vw))"
    }

    if(tileNr == 1 || tileNr == 4 || tileNr == 7){
        icon.style.marginLeft = "calc(-10vw - 0.32vw + (5vw - 1.85vw))"
    }
    else if(tileNr == 2 || tileNr == 5 || tileNr == 8){
        icon.style.marginLeft = "calc(5vw - 1.85vw)"
    }
    else if(tileNr == 3 || tileNr == 6 || tileNr == 9){
        icon.style.marginLeft = "calc(10vw + 0.32vw + (5vw - 1.85vw))"
    }
}

const hideAllBanIcons = function(){
    for(let i = 1; i <= 5; i++){
        hideBanIcon(i)
    }
    banIsVisible = false
}

const hideBanIcon = function(iconNr){
    document.getElementById("ban-icon" + iconNr.toString()).style.visibility = "hidden"
}

const updateBanIconPosition = function(){
    var banAmount = 0

    for(let i = 0; i < canPlaceHere.length; i++){
        if(!canPlaceHere[i] && tiles[i] != "Y"){
            banAmount = banAmount + 1
            banIsVisible = true
            setBanIconToTile(banAmount, i + 1)
        }
    }

    if(banAmount < 5){
        for(let i = banAmount + 1; i <= 5; i++){
            hideBanIcon(i)
        }
    }
}

const checkWinCondition = function(){
    if(winner == 0){
        delete socket
        setTimeout(function(){
            document.getElementById("win-alert").style.display = "inherit"
            document.getElementById("play-again-button").addEventListener("click", function(event){
                document.getElementById("win-alert").style.display = "none"
                resetGame()
                setUpOpponentWaiter()
            })
        }, 800)
        document.getElementById("turn-pill").style.border = "none"
        document.getElementById("turn-pill").style.width = "222px"
        document.getElementById("turn-pill").style.height = "70px"
        document.getElementById("turn-pill-text").style.top = "4px"
        document.getElementById("turn-pill-text").style.marginLeft = "initial"
        if(myColor == "R"){
            setTurnText("You win!")
            document.getElementById("win-alert-text").innerText = "You win!"
            document.getElementById("crown").src = "crown.png"
            document.getElementById("play-again-button-text").style.color = "#F01C17"
            document.getElementById("turn-pill").style.backgroundColor = "#F01C17"
        }
        else if(myColor == "B"){
            setTurnText("Opponent wins!")
            document.getElementById("win-alert-text").innerText = "You lost!"
            document.getElementById("crown").src = "close.png"
            document.getElementById("play-again-button-text").style.color = "#002AA2"
            document.getElementById("turn-pill").style.backgroundColor = "#F01C17"
        }
        document.getElementById("turn-pill").style.display = "inherit"
        document.getElementById("opponent-wait-animation").style.visibility = "hidden"
        document.getElementById("bottombar-text").style.visibility = "hidden"
    }
    else if(winner == 1){
        delete socket
        setTimeout(function(){
            document.getElementById("win-alert").style.display = "inherit"
            document.getElementById("play-again-button").addEventListener("click", function(event){
                document.getElementById("win-alert").style.display = "none"
                resetGame()
                setUpOpponentWaiter()
            })
        }, 800)
        document.getElementById("turn-pill").style.border = "none"
        document.getElementById("turn-pill").style.width = "222px"
        document.getElementById("turn-pill").style.height = "70px"
        document.getElementById("turn-pill-text").style.top = "4px"
        document.getElementById("turn-pill-text").style.marginLeft = "initial"
        if(myColor == "R"){
            setTurnText("Opponent wins!")
            document.getElementById("win-alert-text").innerText = "You lost!"
            document.getElementById("crown").src = "close.png"
            document.getElementById("play-again-button-text").style.color = "#F01C17"
            document.getElementById("turn-pill").style.backgroundColor = "#002AA2"
        }
        else if(myColor == "B"){
            setTurnText("You win!")
            document.getElementById("win-alert-text").innerText = "You win!"
            document.getElementById("crown").src = "crown.png"
            document.getElementById("play-again-button-text").style.color = "#002AA2"
            document.getElementById("turn-pill").style.backgroundColor = "#002AA2"
        }
        document.getElementById("turn-pill").style.display = "inherit"
        document.getElementById("opponent-wait-animation").style.visibility = "hidden"
        document.getElementById("bottombar-text").style.visibility = "hidden"
    }
}

const getCookie = function(cname){
    var name = cname + "="
    var decodedCookie = decodeURIComponent(document.cookie)
    var ca = decodedCookie.split(";")
    for(var i = 0; i < ca.length; i++){
        var c = ca[i]
        while(c.charAt(0) == " "){
            c = c.substring(1)
        }
        if(c.indexOf(name) == 0){
            return c.substring(name.length, c.length)
        }
    }
    return null
}

const setCookie = function(name, value, days){
    var expires = ""
    if(days){
        var date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        expires = "; expires=" + date.toUTCString()
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/"
}

const setUpOpponentWaiter = function(){
    setTurnText("Connecting")
    socket = io("https://server.culors.io")
    socket.on("connect", function(){
        setTurnText("Searching for opponent")
    })
    socket.on("disconnect", function(){
        if(winner == null){
            resetGame()
            showYouWereUnexpectedlyDisconnected()
        }
    })
    socket.on("matchCreated", function(receivedColor){
        myColor = receivedColor
        setBanIconToTile(1, 5)

        if(myColor == "R"){
            setMyColorText("Your color is: Red")
            setTurnText("Your turn<br/><span class=\"small-pill-text\">color</span>")
            document.getElementById("turn-pill").style.display = "inherit"
            document.getElementById("opponent-wait-animation").style.visibility = "hidden"
            document.getElementById("bottombar-text").style.visibility = "hidden"
        }
        else if(myColor == "B"){
            setMyColorText("Your color is: Blue")
            setTurnText("Opponent's turn<br/><span class=\"small-pill-text\">color</span>")
            document.getElementById("turn-pill").style.display = "inherit"
            document.getElementById("opponent-wait-animation").style.visibility = "hidden"
            document.getElementById("bottombar-text").style.visibility = "hidden"
        }
        socket.on("data", function(data){
            playerTurn = data.playerTurn
            tiles = data.tiles
            canPlaceHere = data.canPlaceHere
            blockerWasPlaced = data.blockerWasPlaced
            redHasPlaced = data.redHasPlaced
            blueHasPlaced = data.blueHasPlaced
            winner = data.winner
            setBoardColors()
            updateBanIconPosition()
            updateTurnText()
            checkWinCondition()
            canClickTile = true
        })
        registerAllTileClickEvents()
        socket.on("opponentDisconnected", function(_){
            if(myColor == "R" && winner == null){
                winner = 0
                setTurnText("You win!<br/><span class=\"small-pill-text\">opponent disconnected</span>")
                document.getElementById("turn-pill").style.width = "222px"
                document.getElementById("turn-pill").style.height = "70px"
                document.getElementById("turn-pill-text").style.top = "initial"
                document.getElementById("turn-pill-text").style.marginLeft = "initial"
                document.getElementById("turn-pill").style.backgroundColor = "#F01C17"
                document.getElementById("turn-pill").style.border = "none"
            }
            else if(myColor == "B" && winner == null){
                winner = 1
                setTurnText("You win!<br/><span class=\"small-pill-text\">opponent disconnected</span>")
                document.getElementById("turn-pill").style.width = "222px"
                document.getElementById("turn-pill").style.height = "70px"
                document.getElementById("turn-pill-text").style.top = "initial"
                document.getElementById("turn-pill-text").style.marginLeft = "initial"
                document.getElementById("turn-pill").style.backgroundColor = "#002AA2"
                document.getElementById("turn-pill").style.border = "none"
            }
            delete socket
        })
    })
}

const showYouWereUnexpectedlyDisconnected = function(){
    document.getElementById("disconnect-alert").style.display = "inherit"
    setTimeout(function(){
        document.getElementById("disconnect-alert").style.display = "none"
    }, 5000)
}

const setBoardColors = function(){
    for(let i = 0; i < tiles.length; i++){
        const tile = document.getElementById("tile" + (i + 1).toString())
        if(tiles[i] == "R"){
            tile.style.backgroundColor = "#F01C17"
        }
        else if(tiles[i] == "B"){
            tile.style.backgroundColor = "#002AA2"
        }
        else if(tiles[i] == "Y"){
            tile.style.backgroundColor = "#F4E620"
        }
        else if(tiles[i] == "O"){
            tile.style.backgroundColor = "lightgrey"
        }
    }
}

const setMyColorText = function(text){
    /*document.getElementById("my-color").innerText = text*/
}