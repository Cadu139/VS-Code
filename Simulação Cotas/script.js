
const canvas = document.getElementById('race');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 20;
const TILES_Y = 25;
const TILES_X = 25;
const INTERVAL = 500;

const totalPlayers = 100;
const advancedCount = 30;
const delayedCount = 70;
const players = [];

const powerups = [];
const traps = [];
let tick = 0;

const colors = {
    advanced: 'blue',
    delayed: 'green',
    attack: 'orange',
    shield: 'purple',
    speed: 'yellow',
    trap: 'red'
};

function initPlayers() {
    players.length = 0;
    const shuffledIndexes = Array.from({length: totalPlayers}, (_, i) => i);
    shuffledIndexes.sort(() => Math.random() - 0.5);
    for (let i = 0; i < totalPlayers; i++) {
    const type = i < delayedCount ? 'delayed' : 'advanced';
    const row = Math.floor(i / TILES_X);
    const col = i % TILES_X;
    players.push({
        id: shuffledIndexes[i],
        x: col * TILE_SIZE,
        y: row * TILE_SIZE,
        type,
        speed: 1,
        frozen: 0,
        shield: 0,
        finished: false,
        tileY: 0,
    });
    }
}

function randomizeTiles(array, type, count) {
    array.length = 0;
    while (array.length < count) {
    const x = Math.floor(Math.random() * TILES_X);
    const y = Math.floor(Math.random() * TILES_Y);
    if (!array.some(t => t.x === x && t.y === y)) {
        array.push({ x, y, type });
    }
    }
}

function applyPowerups(player) {
    const x = player.x / TILE_SIZE;
    const y = player.tileY;
    const found = powerups.find(p => p.x === x && p.y === y);
    if (found) {
    if (found.type === 'speed') {
        player.speed += 1;
    } else if (found.type === 'attack') {
        const targets = players.filter(p => p.tileY > player.tileY && !p.finished && p.shield === 0);
        if (targets.length > 0) {
        const target = targets[Math.floor(Math.random() * targets.length)];
        target.frozen = 4; // 2 seconds = 4 ticks
        }
    } else if (found.type === 'shield') {
        player.shield = 10; // 5 seconds = 10 ticks
    }
    }
}

function applyTraps(player) {
    const x = player.x / TILE_SIZE;
    const y = player.tileY;
    const found = traps.find(t => t.x === x && t.y === y);
    if (found && player.shield === 0) {
    player.frozen = 2;
    }
}

function updatePlayers() {
    for (const p of players) {
    if (p.finished) continue;
    if (p.frozen > 0) {
        p.frozen--;
        continue;
    }
    if (p.shield > 0) p.shield--;

    applyPowerups(p);
    applyTraps(p);

    p.tileY += p.speed;
    p.y = p.tileY * TILE_SIZE;
    if (p.tileY >= TILES_Y) p.finished = true;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of players) {
    ctx.fillStyle = colors[p.type];
    ctx.fillRect(p.x, p.y, TILE_SIZE, TILE_SIZE);
    if (p.shield > 0) {
        ctx.strokeStyle = colors.shield;
        ctx.strokeRect(p.x, p.y, TILE_SIZE, TILE_SIZE);
    }
    }

    for (const power of powerups) {
    ctx.fillStyle = colors[power.type];
    ctx.fillRect(power.x * TILE_SIZE, power.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
    for (const trap of traps) {
    ctx.fillStyle = colors.trap;
    ctx.fillRect(trap.x * TILE_SIZE, trap.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
}

function getRanking() {
    const finished = players.filter(p => p.finished);
    finished.sort((a, b) => a.tileY - b.tileY);

    const result = [];
    const counts = { first: 0, second: 0, third: 0 };
    const limits = { first: 2, second: 2, third: 4 };
    const groupLimits = {
    first: { advanced: 1, delayed: 1 },
    second: { advanced: 1, delayed: 1 },
    third: { advanced: 1, delayed: 3 },
    };

    for (const p of finished) {
    for (const place of ['first', 'second', 'third']) {
        if (counts[place] < limits[place] && groupLimits[place][p.type] > 0) {
        result.push({ rank: place, player: p });
        counts[place]++;
        groupLimits[place][p.type]--;
        break;
        }
    }
    }

    return result;
}

function showRanking() {
    const rankDiv = document.getElementById('ranking');
    const result = getRanking();

    const table = document.createElement('table');
    const header = table.insertRow();
    header.innerHTML = '<th>Colocação</th><th>Jogadores</th>';

    const ranks = ['first', 'second', 'third'];
    const labels = { first: '1º Lugar', second: '2º Lugar', third: '3º Lugar' };
    for (const rank of ranks) {
    const row = table.insertRow();
    row.insertCell().innerText = labels[rank];
    const playersCell = row.insertCell();
    playersCell.innerText = result
        .filter(r => r.rank === rank)
        .map(p => `${p.player.type} #${p.player.id}`)
        .join(', ');
    }

    rankDiv.innerHTML = '';
    rankDiv.appendChild(table);
}

function loop() {
    tick++;
    updatePlayers();
    draw();
    if (players.every(p => p.finished)) {
    showRanking();
    return;
    }
    setTimeout(loop, INTERVAL);
}

// Inicializar tudo
initPlayers();
randomizeTiles(powerups, 'speed', 10);
randomizeTiles(powerups, 'attack', 5);
randomizeTiles(powerups, 'shield', 5);
randomizeTiles(traps, 'trap', 10);
draw();
setTimeout(loop, 1000);