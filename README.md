# Niya-React

This website is accessible at [this link](https://lorenzoluna.herokuapp.com/).

## Warning

**This project is deployed on Heroku on a _free dyno_ and therefore will take some time to load if the server needs to be restarted.**

## Description

This website uses React to create an interactive user interface. Styling is handled using base CSS with no frameworks.

### Game Rules

The players take turns placing a token on the tiles. On the first turn the tiles are randomly shuffled and then the first player can only place a token on the tiles at the borders of the board. After the first turn a player can only place a token on a tile that shares a symbol or plant with the tile that the previously played token, which allows the players to influence and force each other's moves. The goal of the game is to achieve one of the three winning conditions.

### Winning Conditions

* A player wins if he places four of his tokens in a line on the board. This includes vertical, horizontal, and diagonal lines.
* A player wins if he places four of his tokens in a square anywhere on the board.
* A player wins if after his move the other player cannot place his token anywhere.

## Website Features

- Clicking on a tile will place a token on it on behalf of the current player which is displayed at the bottom. You can only place a token on a tile that is shown in green, following the game's rules. You can play a full game by alternating between the players and placing tokens. The game ends when one of the winning conditions is achieved by one of the players, disallowing any further moves.

- At any moment you can restart the game by clicking on the New Game button. This will reset the state of the application and reshuffle the tiles on the board.

- The players' moves are saved and can be reviewed by using the Back and Forward buttons. You can use this feature to undo a move or replay the game with the same tile configuration. If you place a token when viewing a previous game state you will delete all the moves that have been made after it and will be able to continue the game from the move you have just made. This is great for trying different "what if" scenarios to see how your moves influence the outcome of the game.

## Disclaimer

This is a purely personal project with the purpose of practicing and showcasing web development skills. It is not intended for commercial use and will be made unavailable at request of the original board game creator if any concerns about copyright arise.
