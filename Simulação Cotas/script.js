
const layers = [];
const nlayers = 2; // Number of layers to be used

for (let z = 0; z <= nlayers-1; z++){
    layers.push(document.getElementById(`layer${z}`));
    document.getElementById(`layer${z}`).style.zIndex = z;
}

const canvas = layers[1];

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const ctx = canvas.getContext('2d');

const totalRow = 20;
const TILE_SIZE = (canvas.width) / totalRow;
const INTERVAL = 250;

function draw(x, y, color, count_x, count_y) {
    ctx.fillStyle = color;
    for (let cX = 0; cX < count_x; cX++) {
        for (let cY = 0; cY < count_y; cY++) {
            ctx.fillRect((TILE_SIZE + 0.125) * (x + cX - 1), (TILE_SIZE + 0.125) * (y + cY - 1), (TILE_SIZE - 2.5), (TILE_SIZE - 2.5));
        };
    };
}

function drawGrade(step, count, interval) {
    for (let d = step; d < (step + count); d++) {
        setTimeout(() => {
            for (let a = 1; a <= 20; a++){
                for (let b = 1; b <= 20; b++){
                    if (a + b == d + 1 ){
                        draw(a, b, 'lightgreen', 1, 1);
                    }
                }
            }
        }, interval * d);
    }
};

canvas.addEventListener('click', function() {drawGrade(1, totalRow * 2, 200)});

canvas.addEventListener('mousemove', function(mouse) {
    const xmouse = (mouse.pageX - canvas.offsetLeft) * (totalRow / canvas.width);
    const ymouse = (mouse.pageY - canvas.offsetTop) * (totalRow / canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(xmouse, ymouse, "red", 1, 1);
});