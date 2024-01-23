/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    // create a new div element, which will become the game card
    // add the class game-card to the list
    // set the inner HTML using a template literal to display some info 
    // about each game
    // TIP: if your images are not displaying, make sure there is space
    // between the end of the src attribute and the end of the tag ("/>")

    // append the game to the games-container
    // for .. in - > iterate over properties of an Iterable. the order is not maintained 
    // for .. of -> iterate over the values. similar to forEach, order is maintained
    for (const game of games) {
        const gameCard = document.createElement('div');

        gameCard.classList.add("game-card");

        const display = ` 
        <img src= "${game.img}" class="game-img"/>
        <h2> ${game.name}</h2>
        <p> ${game.description}</p>
        <p> ${game.backers} backers pledged $ ${game.pledged.toLocaleString('en-US')} </p>`;

        gameCard.innerHTML = display;
        gamesContainer.appendChild(gameCard);
    }
}
// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
// set the inner HTML using a template literal and toLocaleString to get a number with commas
let total = GAMES_JSON.reduce((acc, game) =>  {return acc + game.backers} , 0).toLocaleString('en-US');
const display = `<p> ${total} </p>`
contributionsCard.innerHTML = display;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((acc, game) => {return acc + game.pledged}, 0).toLocaleString('en-US');
const displayRaised = `<p> $${totalRaised}</p>`

// set inner HTML using template literal
raisedCard.innerHTML = displayRaised; 

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalGames = GAMES_JSON.length;
const displayGames = `<p> ${totalGames}</p>`;
gamesCard.innerHTML = displayGames; 

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);
    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter((game) => {return game.pledged < game.goal});
    console.log('Number of unfunded ', unfundedGames);
    // use the function we previously created to add the unfunded games to the DOM
    return addGamesToPage(unfundedGames); 
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);
    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter((game) => {return game.pledged >= game.goal});
    console.log('Number of funded ', fundedGames);
    // use the function we previously created to add unfunded games to the DOM
    return addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);
    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

}

function sortByPledges() {
    deleteChildElements(gamesContainer);
    const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
        return item2.pledged - item1.pledged;
    });
    return addGamesToPage(sortedGames);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");
const sortBtn = document.getElementById("sort-games");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);
sortBtn.addEventListener("click",sortByPledges );


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames = GAMES_JSON.filter((game) => {return game.pledged < game.goal});
const unfunded_games = GAMES_JSON.reduce((acc, game) => (game.pledged < game.goal) ? acc + 1 : acc, 0);

const fundedGames = GAMES_JSON.filter((game) => {return game.pledged >= game.goal});
const raisedFunded = GAMES_JSON.reduce((acc, game) => (game.pledged >= game.goal) ? acc + game.pledged : acc, 0).toLocaleString('en-US');

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${raisedFunded} has been raised for ${fundedGames.length} games. Currently, ${unfundedGames.length} ${(unfundedGames === 1) ? " game remains " : " games remain "} unfunded.
We need your help to fund these amazing games!`

// create a new DOM element containing the template string and append it to the description container
const element = document.createElement("p");
element.textContent = displayStr; 
descriptionContainer.appendChild(element); 

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [first, sec, ...others] = sortedGames
const word1 = first.name.split(' ')[0], word2 = sec.name.split(' ')[0];
console.log('First word of 1st', word1, 'First word of 2nd', word2);

// create a new element to hold the name of the top pledge game, then append it to the correct element
const elem = document.createElement("h4");
elem.textContent = `${first.name}`; 
firstGameContainer.appendChild(elem);

// do the same for the runner up item
const elem2 = document.createElement("h4");
elem2.textContent = `${sec.name}`; 
secondGameContainer.appendChild(elem2);

function filterTopGame() {
    deleteChildElements(gamesContainer);
    addGamesToPage([sortedGames[0]]);
}

function filterSecGame() {
    deleteChildElements(gamesContainer);
    addGamesToPage([sortedGames[1]]);
}

const topGame = document.getElementById("top-game");
const secGame = document.getElementById("sec-game");

topGame.addEventListener("click", filterTopGame);
secGame.addEventListener("click", filterSecGame);

/************************************************************************************
 * Challenge 7: Customizations
 * Added: 
 * Search for games, Sort Games, Change button cursor
 * UI updates,
 * Click on Top funded, Runner up games
 */

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");

function searchGames() {
    deleteChildElements(gamesContainer);
    let searchGame = undefined;
    const input = searchInput.value; 
    console.log('User typed: ', input);

    if(input) {
        searchGame = GAMES_JSON.filter((game) => game.name.toLowerCase().includes(input.toLowerCase()));
        const [match, ...others] = searchGame;
        console.log('Found ', match.name, searchGame);

        if (searchGame.length > 0) {
            addGamesToPage(searchGame);
        } else {
            deleteChildElements(gamesContainer); 
            gamesContainer.textContent = "No games found matching search.";
        }
    } else {
        deleteChildElements(gamesContainer);
        gamesContainer.textContent = "Please enter a game to search.";
    }
    
}
// add event listeners to button and for Enter key
searchButton.addEventListener('click', searchGames)
searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') { searchButton.click(); } 
})

