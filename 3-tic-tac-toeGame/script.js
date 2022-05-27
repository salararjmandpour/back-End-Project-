const ticTacToe = (function () {
    const infoElement = document.getElementById('info');
    const cellElement = document.querySelectorAll(".cell");
    const cells = [];
    let player = "O";
    let playing = true;
    infoElement.innerText = `Playing: ${player} `;

    //>----------------------- foreach from cellElement

    cellElement.forEach((item, index) => {
        item.addEventListener("click", (event) => cellClickHandler(event, index));
        cells[index] = {
            element: item,
            value: null,
            reset() {
                cells[index].element.classList.remove(this.value);
                this.value = null;
            }
        }
    })

    //>----------------------- method check click handler the cell

    function cellClickHandler(event, index) {
        if (playing && cells[index].value === null) {
            cells[index].value = player;
            cells[index].element.classList.add(player);
            togglePlayer();
            checkWinner();
        }
    }
    //>----------------------- method toggle Player

    function togglePlayer() {
        player = player === "O" ? "X" : "O";
        infoElement.innerText = `Playing: ${player} `;
    }
    //>----------------------- method check Winner

    function checkWinner() {
        let winner = null;
        if (cells[0].value !== null && cells[0].value === cells[1].value && cells[1].value === cells[2].value) winner = cells[2].value;//1.row
        else if (cells[3].value !== null && cells[3].value === cells[4].value && cells[4].value === cells[5].value) winner = cells[5].value;//2.row
        else if (cells[6].value !== null && cells[6].value === cells[7].value && cells[7].value === cells[8].value) winner = cells[8].value;//3.row
        else if (cells[0].value !== null && cells[0].value === cells[3].value && cells[3].value === cells[6].value) winner = cells[6].value;//1.col
        else if (cells[1].value !== null && cells[1].value === cells[4].value && cells[4].value === cells[7].value) winner = cells[7].value;//2.col
        else if (cells[2].value !== null && cells[2].value === cells[5].value && cells[5].value === cells[8].value) winner = cells[8].value;//3.col
        else if (cells[0].value !== null && cells[0].value === cells[4].value && cells[4].value === cells[8].value) winner = cells[8].value;//dia ltr
        else if (cells[2].value !== null && cells[2].value === cells[4].value && cells[4].value === cells[6].value) winner = cells[6].value;//dia rtl
        if (winner !== null) {
            playing = false;
            infoElement.innerHTML = `Winner of the game: ${winner} <button onClick="ticTacToe.restart()">please play again</button> `;
        } else if (
            cells[0].value !== null && cells[1].value !== null && cells[2].value !== null &&
            cells[3].value !== null && cells[4].value !== null && cells[5].value !== null &&
            cells[6].value !== null && cells[7].value !== null && cells[8].value !== null
        ) {
            playing = false;
            infoElement.innerHTML = `The game did not win <button onClick="ticTacToe.restart()">please play again</button> `;
        }
    }
    //>----------------------- return method restart game
    return {
        restart() {
            playing = true;
            togglePlayer();
            cells.forEach(item => item.reset());
        }
    }
})();