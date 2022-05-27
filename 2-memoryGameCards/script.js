(function game() {
    const wrapper = document.querySelector('.game-wrapper');
    const row = 6; //row 
    const col = 6; //col
    const cells = [];
    const symbols = "ABCDEFGHIJKLMNOUPRSTUY1234567890".split("");
    let previousCallIndex = null; // select click the card?
    let canPlay = false; // to allow the game
    let p = (row * col) / 2;
    //--------------------- create grid
    const grid = document.createElement('div');
    grid.classList.add('grid');
    wrapper.appendChild(grid);
    //--------------------- create info panel
    const infoPanel = document.createElement('div');
    infoPanel.classList.add('info-panel');
    wrapper.appendChild(infoPanel);
    //--------------------- create game over
    const gameOver = document.createElement('div');
    gameOver.classList.add('game-over');
    wrapper.appendChild(gameOver);

    //--------------------- create cells
    for (let i = 0; i < row * col; i += 2) {
        const symbol = randomSymbol();

        for (let j = 0; j < 2; j++) {
            const currentCellIndex = i + j;
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.style.width = `${100 / col}%`;
            cellElement.innerText = symbol;

            const cell = {
                symbol,
                element: cellElement,
                hasMatch: false
            }

            setTimeout(() => {
                cellElement.classList.add('hide');
            }, randomInt(1500, 2000));

            // if (currentCellIndex > 2) {
            //     const previousRandomIndex = randomInt(0, i);
            //     cells[currentCellIndex] = cells[previousRandomIndex];
            //     cells[previousRandomIndex] = cell;


            // } else {
            //     cells[currentCellIndex] = cell;
            //     console.log(cells);

            // }

            const previousRandomIndex = randomInt(0, i);
            cells[currentCellIndex] = cells[previousRandomIndex];
            cells[previousRandomIndex] = cell;



        }
    }
    console.log(cells);
    //--------------------- add all elements
    cells.forEach((item, index) => {
        item.element.addEventListener('click', () => cellClickHandler(index));
        grid.appendChild(item.element);
        canPlay = true;
    })
    function randomSymbol() {
        const symbolIndex = randomInt(0, symbols.length - 1);
        const symbol = symbols[symbolIndex];
        //--------------------- delete symbol from symbols
        symbols.splice(symbolIndex, 1);
        return symbol;
    }

    function randomInt(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }

    function cellClickHandler(index) {

        const cellElement = cells[index].element;
        if (canPlay && cellElement.classList.contains('hide')) {
            canPlay = false;
            cellElement.classList.remove('hide');
            if (previousCallIndex === null) {
                //--------------------- first click
                previousCallIndex = index;
                canPlay = true;
            } else {
                // console.log(cells[previousCallIndex].symbol , cells[index].symbol);
                if (cells[previousCallIndex].symbol === cells[index].symbol) {
                    cells[previousCallIndex].hasMatch = true;
                    cells[index].hasMatch = true;
                    showInfo('Match Cards', 'green');
                    setTimeout(() => {
                        previousCallIndex = null;
                        canPlay = true;
                    }, 500)
                } else {
                    setTimeout(() => {
                        showInfo('No Match Cards', 'red');
                        game_Over(p);
                        console.log(p);
                        p--;

                        cells[previousCallIndex].element.classList.add('hide');
                        cellElement.classList.add('hide');
                        previousCallIndex = null;
                        canPlay = true;
                    }, 800);


                }
            }
        }
        // console.log(cellElement);
    }
    function showInfo(message, type) {
        infoPanel.innerHTML = `<span class='${type}'>${message}</span>`;
    }
    function game_Over(order) {
        if (order === 0) {
            gameOver.innerHTML = `<span class='order'>Game Over 😖 Please Refresh Page </span>`;
            console.log(order);
            throw canPlay = false;
        }
    }
})();
// game();