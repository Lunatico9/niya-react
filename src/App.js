import React from 'react';
import './App.css';


function Tile(props) {
    if (props.color) {
        return (
            <button className={(props.color === 'R' ? 'tile red' : 'tile black')}>
                {props.color === "R" ? "Red" : "Black"}
            </button>
        )
    } else {
        return (
            <button className={props.available ? "tile available" : "tile not-available"} onClick={props.onClick}>
                {props.tile.plant}
                    <br />
                {props.tile.symbol}
            </button>
        )
    }
}

class Board extends React.Component {
    renderTile(i) {
        return (
            <Tile tile={this.props.tiles[i]} available={this.props.availableTiles[i]} color={this.props.colors[i]} onClick={() => this.props.onClick(i)} />
        );
    }
    render() {
        let tiles = [];
        for (let row = 0; row < 4; row++){
            let tileRow = [];
            for (let col = 0; col < 4; col++){
                tileRow.push(<span key={row*4 + col}>{this.renderTile(row*4 + col)}</span>);
            }
            tiles.push(<div className="board-row" key={row}>{tileRow}</div>);
        }
        return (
            <div>
                {tiles}
            </div>
        );
    }
}

class Info extends React.Component {
    render() {
        const victory = this.props.victory;
        const player = this.props.nextPlayer === "R" ? "Red" : "Black";
        const previousPlayer = this.props.vp === "R" ? "Red" : "Black";
        const nextPlayer = "Next player: " + player;
        const lastTile = this.props.lastTile === null ? "First Turn!" : "Last tile was: " + this.props.lastTile.plant + " and " + this.props.lastTile.symbol
        return (
            <div className="game-info">
                <div className="next">
                    {victory &&
                        <div className="victory">
                            The {previousPlayer} player won!
                        </div>
                    }
                    {!victory && <div className="next-player">{nextPlayer}</div>}
                    <div className="next-tile">
                        {lastTile}
                    </div>
                </div> 
                <div className="history-buttons">
                    {this.props.buttons}
                </div>
            </div>
            
        )
    }
}

class SidePanel extends React.Component {
    render() {
        const side = this.props.side;
        if (side === "left"){
            return (
                <div className="col-content">
                    <h2>Game Rules</h2> 
                    <p>The players take turns placing a token on the tiles. On the first turn the tiles are randomly shuffled and then the first player can only place a token on the tiles at the borders of the board. After the first turn a player can only place a token on a tile that shares a symbol or plant with the tile that the previously played token, which allows the players to influence and force each other's moves. The goal of the game is to achieve one of the three winning conditions.</p>
                    <h3>Winning Conditions</h3>
                    <ul>
                        <li>A player wins if he places four of his tokens in a line on the board. This includes vertical, horizontal, and diagonal lines.</li>
                        <li>A player wins if he places four of his tokens in a square anywhere on the board.</li>
                        <li>A player wins if after his move the other player cannot place his token anywhere.</li>
                    </ul>
                </div>
            )
        } else {
            return (
                <div className="col-content">
                    <h2>Website Features</h2>
                    <ul>
                        <li>Clicking on a tile will place a token on it on behalf of the current player which is displayed at the bottom. You can only place a token on a tile that is shown in green, following the game's rules. You can play a full game by alternating between the players and placing tokens. The game ends when one of the winning conditions is achieved by one of the players, disallowing any further moves.</li>
                        <li>At any moment you can restart the game by clicking on the New Game button. This will reset the state of the application and reshuffle the tiles on the board.</li>
                        <li>The players' moves are saved and can be reviewed by using the Back and Forward buttons. You can use this feature to undo a move or replay the game with the same tile configuration. If you place a token when viewing a previous game state you will delete all the moves that have been made after it and will be able to continue the game from the move you have just made. This is great for trying different "what if" scenarios to see how your moves influence the outcome of the game.</li>
                    </ul>    
                </div>
            )
        }
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.newGame = this.newGame.bind(this);
        this.jumpTo = this.jumpTo.bind(this);
        this.forward = this.forward.bind(this);
        this.back = this.back.bind(this);
        const tiles = shuffle(this.props.tiles.slice());
        this.state = {
            tiles: tiles,
            history: [
                {
                    colors: Array(tiles.length).fill(null),
                    lastTile: null
                }
            ],
            stepNumber: 0,
            rIsNext: true,
        };
    }

    newGame() {
        const tiles = shuffle(this.props.tiles.slice());
        this.setState({
            tiles: tiles,
            history: [
                {
                    colors: Array(tiles.length).fill(null),
                    lastTile: null
                }
            ],
            stepNumber: 0,
            rIsNext: true,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            rIsNext: (step % 2) === 0
        });
    }

    forward(step) {
        if (step < this.state.history.length - 1) {
            this.jumpTo(step + 1);
        }
    }

    back(step) {
        if (step > 0) {
            this.jumpTo(step - 1);
        }
    }


    findAvailableMoves(tiles, lastTile) {
        if (lastTile) {
            const symbol = lastTile.symbol;
            const plant = lastTile.plant;
            return tiles.map((tile, index) => {
                if (symbol === tile.symbol || plant === tile.plant) {
                    return true;
                } else {
                    return false;
                }
            });
        } else {
            return ALLOWED_FIRST_MOVE_TILES;
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const tiles = this.state.tiles;
        const lastTile = current.lastTile;
        const availableMoves = this.findAvailableMoves(tiles, lastTile);
        if (availableMoves[i] === false) {
            return;
        }
        if (this.checkVictory(this.state.rIsNext ? "B" : "R", current.colors, availableMoves)) {
            return;
        }
        const colors = current.colors.slice();
        colors[i] = this.state.rIsNext ? "R" : "B";
        this.setState({
            history: history.concat([
                {
                    colors: colors,
                    lastTile: tiles[i]
                }
            ]),
            stepNumber: history.length,
            rIsNext: !this.state.rIsNext,
        });
    }

    checkVictory(player, colors, allowedMoves) {
        const checkCanMove = function(allowedMoves, colors) {
            for (let i = 0; i < allowedMoves.length; i++){
                if (colors[i] || !allowedMoves[i]) {
                    continue;
                } else {
                    return true;
                }
            }
            return false;
        }
        if (checkCanMove(allowedMoves, colors)){
            const lines = function () {
                let lineArray = [];
                for (let i = 0; i < 4; i++) {
                    lineArray.push([i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 3]);
                }
                return lineArray;
            }
            const columns = function () {
                let colArray = [];
                for (let i = 0; i < 4; i++) {
                    colArray.push([i, i + 4, i + 8, i + 12]);
                }
                return colArray;
            }
            const squares = function () {
                let squaresArray = [];
                for (let i = 0; i < 12; i++) {
                    if (i % 4 === 3) {
                        continue;
                    }
                    squaresArray.push([i, i + 1, i + 4, i + 5]);
                }
                return squaresArray;
            }
            const diags = [[0, 5, 10, 15], [3, 6, 9, 12]];
            const victoryConditions = lines().concat(columns().concat(squares().concat(diags)));

            for (const condition of victoryConditions) {;
                const [a, b, c, d] = condition;
                if (colors[a] && colors[a] === player && colors[b] === player && colors[c] === player && colors[d] === player) {
                    return true;
                }
            }
            return false;
        } else {
            return true;
        }
    }

render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const nextPlayer = this.state.rIsNext ? "R" : "B";
    const previousPlayer = this.state.rIsNext ? "B" : "R";
    const lastTile = current.lastTile;
    const availableMoves = this.findAvailableMoves(this.state.tiles, lastTile)
    const previousPlayerVictory = this.checkVictory(previousPlayer, current.colors, availableMoves);

    const buttons = [
        <button className={this.state.stepNumber > 0  ? "back enable button tooltip" : "back disable button tooltip"} key={0} onClick={() => this.back(this.state.stepNumber)}><span className="tooltip-text">Go back one move</span><i class="fas fa-step-backward fa-2x"></i></button>,
        <button className="new-game button enable tooltip" key={1} onClick={this.newGame}><span className="tooltip-text">Shuffle the board and start a new game</span><i class="fas fa-redo-alt fa-2x"></i></button>,
        <button className={this.state.stepNumber < this.state.history.length - 1  ? "forward enable button tooltip" : "forward disable button tooltip"} key={2} onClick={() => this.forward(this.state.stepNumber)}><span className="tooltip-text">Go forward one move</span><i class="fas fa-step-forward fa-2x"></i></button>
    ];

    return (
        <div className="content">
            <div className="col left-col">
                <SidePanel side={"left"}/>
            </div>
            <div className="game">
                <div className="title">
                    <h1>Niya React</h1>
                </div>
                <div className="game-board">
                    <Board colors={current.colors} tiles={this.state.tiles} availableTiles={availableMoves} onClick={(i) => this.handleClick(i)} />
                </div>
                <Info nextPlayer={nextPlayer} lastTile={lastTile} buttons={buttons} victory={previousPlayerVictory} vp={previousPlayer} />
            </div>
            <div className="col right-col">
                <SidePanel side={"right"}/>
            </div>
        </div>
    );
}
}

const ALLOWED_FIRST_MOVE_TILES = [true, true, true, true,
    true, false, false, true,
    true, false, false, true,
    true, true, true, true]
/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
var shuffle = function (array) {

    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;

};

export default App;
