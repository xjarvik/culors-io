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

document.addEventListener("DOMContentLoaded", function(event){
    setUpOpponentWaiter()
})

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
        }
        if(winner == null && playerTurn == 0 && myColor == "R" && canClickTile && !clickedOnBan
        || winner == null && playerTurn == 1 && myColor == "B" && canClickTile && !clickedOnBan){
            canClickTile = false
            socket.emit("tileClick", tileNr.toString())
        }
    })
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
    document.getElementById("bottombar-text").innerText = message
}

const updateTurnText = function(){
    if(playerTurn == 0){
        if(getAmountOfRedTiles() < getAmountOfBlueTiles() && redHasPlaced && !blockerWasPlaced){
            if(myColor == "R"){
                setTurnText("Your turn (blocker)")
            }
            else if(myColor == "B"){
                setTurnText("Opponent's turn (blocker)")
            }
        }
        else{
            if(myColor == "R"){
                setTurnText("Your turn (color)")
            }
            else if(myColor == "B"){
                setTurnText("Opponent's turn (color)")
            }
        }
    }
    else if(playerTurn == 1){
        if(getAmountOfBlueTiles() < getAmountOfRedTiles() && blueHasPlaced && !blockerWasPlaced){
            if(myColor == "B"){
                setTurnText("Your turn (blocker)")
            }
            else if(myColor == "R"){
                setTurnText("Opponent's turn (blocker)")
            }
        }
        else{
            if(myColor == "B"){
                setTurnText("Your turn (color)")
            }
            else if(myColor == "R"){
                setTurnText("Opponent's turn (color)")
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
        setTurnText("Red wins!")
    }
    else if(winner == 1){
        setTurnText("Blue wins!")
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
    socket = io("https://server.culors.io")
    socket.on("matchCreated", function(receivedColor){
        myColor = receivedColor
        setBanIconToTile(1, 5)

        if(myColor == "R"){
            setMyColorText("Your color is: Red")
            setTurnText("Your turn (color)")
        }
        else if(myColor == "B"){
            setMyColorText("Your color is: Blue")
            setTurnText("Opponent's turn (color)")
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
                setTurnText("Opponent disconnected, Red wins!")
            }
            else if(myColor == "B" && winner == null){
                winner = 1
                setTurnText("Opponent disconnected, Blue wins!")
            }
            socket.disconnect()
        })
        socket.on("disconnect", function(){
            if(winner == null){
                alert("You were unexpectedly disconnected.")
            }
        })
    })
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