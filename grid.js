const GRID_ROWS = 20;
const GRID_COLS = 20;

const NODES_API = 'http://headlight-tournament-1.herokuapp.com/nodes';
const BOTS_API = 'http://headlight-tournament-1.herokuapp.com/bots';

state = { 
    nodes: {},
    bots: {},
 };

 /**
  * Initiate the grid to DOM. Add cells to DOM nodes into 2D STATE array.
  */
 function doPaint(){
    const grid = document.querySelector(".grid");

    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }

    for (let i = 0; i < GRID_ROWS; i++) {
        for (let j = 0; j < GRID_COLS; j++) {
            let template = document.getElementsByTagName("template")[0];

            console.log(template);
            let cell = template.content.cloneNode(true);
            cell.firstElementChild.classList.add(colorClass(i, j));

            grid.appendChild(cell);   
        }
    }
}

/**
 * Get information pertaining to the nodes
 */
async function refreshNodes(){
    let result = await axios.get(NODES_API);
    let payload = result.data['Nodes'];

    let nodes = {};

    for (let i = 0; i < payload.length; i++) {
        let node = payload[i];
        if (!nodes[node.Location.X]) {
            nodes[node.Location.X] = {};
        }
        nodes[node.Location.X][node.Location.Y] = node;
    }

    state.nodes = nodes;
}

/**
 * Get information pertaining to the bots
 */
async function refreshBots(){
    let result = await axios.get(BOTS_API);
    let payload = result.data['Bots'];

    let bots = {};

    for (let i = 0; i < payload.length; i++) {
        let bot = payload[i];
        if (!bots[bot.Location.X]) {
            bots[bot.Location.X] = {};
        }
        bots[bot.Location.X][bot.Location.Y] = bot;
    }

    state.bots = bots;
}

/**
 * Determines the appropriate color for this grid cell, based on whether 
 * a node, bot, both, or neither is located within this grid cell
 * @param {*} x - x coordinate of grid
 * @param {*} y - y coordinate of grid
 */
function colorClass(x, y){
    let nodes = state.nodes;
    let bots = state.bots;

    let hasNodes = nodes[x] && nodes[x][y];

    let hasBots = bots[x] && bots[x][y];

    if (hasNodes && hasBots) {  // all present
        return 'purple';
    } else if (hasNodes) { // nodes present
        return 'blue';
    } else if (hasBots) { // bots present
        return 'red';
    } else { // neither
        return 'white';
    }
}


$(document).ready(function(){
    doPaint();
    setInterval(() => {
        refreshNodes();
        refreshBots();
        doPaint();
    }, 1500);
});

