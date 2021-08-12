function gameControls(e) {
    if (gamePause === true) return;

    let isHeld = e.type === "keydown" ? true : false;

    switch(e.keyCode) {
        case LEFT:
            leftHeld = isHeld;
            break;
        case RIGHT:
            rightHeld = isHeld;
            break;
        case DOWN:
            downHeld = isHeld;
            break;
        case UP_1:
        case UP_2:
            upHeld = isHeld;
            break;
    }

    // e.preventDefault();
}

function menuControls(e) {
    if (gamePause === false) return;

    let input = e.keyCode;
    if (input === UP_1 || input === UP_2 ) {
        let isStart = gameState === "START";
        let isRetry = gameState === "RETRY";
        
        if (isStart) {
            cursorSelect.style.cursor = "none";
            showScreen(titleScreen, false);
            introLevel();
        } else if (isRetry) {
            gameTimeouts.forEach(t => clearTimeout(t));
            showScreen(deathScreen, false);
            gameElements.length = 0;
        }

        if (isStart || isRetry) {
            gamePlayer.reset();
            gameState = "PLAY";
            gamePause = false;
            LEVELS[0].spawn();
        }
    }
}

document.addEventListener("keydown", menuControls);
document.addEventListener("keydown", gameControls);
document.addEventListener("keyup", gameControls);