import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const TILES = [
    {plant: 'maple', symbol: 'sun'},
    {plant: 'cherry', symbol: 'sun'},
    {plant: 'pine', symbol: 'sun'},
    {plant: 'iris', symbol: 'sun'},    
    {plant: 'maple', symbol: 'poem'},
    {plant: 'cherry', symbol: 'poem'},
    {plant: 'pine', symbol: 'poem'},
    {plant: 'iris', symbol: 'poem'},    
    {plant: 'maple', symbol: 'bird'},
    {plant: 'cherry', symbol: 'bird'},
    {plant: 'pine', symbol: 'bird'},
    {plant: 'iris', symbol: 'bird'},    
    {plant: 'maple', symbol: 'rain'},
    {plant: 'cherry', symbol: 'rain'},
    {plant: 'pine', symbol: 'rain'},
    {plant: 'iris', symbol: 'rain'}
];

ReactDOM.render(
  <React.StrictMode>
    <App tiles={TILES} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
