
//#region : Cria as camadas dinamicamente

    const layers = []; // Array para armazenar as camadas
    const nlayers = 5; // Número de camadas a serem criadas

    for (let z = 0; z <= nlayers-1; z++){
        layers.push(document.getElementById(`${z}`));
        document.getElementById(`${z}`).style.zIndex = z;
    }

//#endregion

//#region : Variáveis de configuração do canvas

    const canvas = (z) => layers[z];
    canvas(0).width = canvas(0).clientWidth;
    canvas(0).height = canvas(0).clientHeight;
    canvas(1).width = canvas(1).clientWidth;
    canvas(1).height = canvas(1).clientHeight;
    const ctx = (z) => layers[z].getContext('2d');

//#endregion

//#region : Variáveis de configuração do grid

    const tileSize = 10; // Tamanho de cada quadrado do grid
    const interval = 0.5 ** tileSize; // Intervalo de tempo entre os passos do grid
    const totalLine = canvas(0).width / tileSize; // Tamanho das linhas e colunas do grid

//#endregion

//#region : Desenho quadrado

    function drawSquare(z, x, y, color, count_x, count_y) {
        ctx(z).fillStyle = color;
        for (let cX = 0; cX < count_x; cX++) {
            for (let cY = 0; cY < count_y; cY++) {
                ctx(z).fillRect((tileSize) * (x + cX - 1), (tileSize) * (y + cY - 1), (tileSize), (tileSize));
            };
        };
    }

//#endregion

//#region : Desenha a animação do grid

    function drawGrid(start, end, mode, r, g, b) {
        ctx(0).clearRect(0, 0, canvas(0).width, canvas(0).height); // Limpa o canvas
        if (mode == "homo") {
            end *= 2; // Se o modo for homogêneo, dobra a contagem de quadrados para todos
            total = start + end;
        }
        else if (mode == "hetero") total = start + end*2; // Se o modo for heterogêneo, duplica a contagem de quadrados para a diagonal
        for (let x = start; x <= end; x++){
            for (let y = start; y <= end; y++){
                drawSquare(0, x, y, `rgba(${r*x}, ${g*y}, ${b}, 1)`, 1, 1); // Define a cor padrão se não for fornecida
            }
        }
    };

//#endregion

//#region : Evento de chamada do grid

    canvas(nlayers-1).addEventListener('click', () => {drawGrid(0, totalLine, "hetero", 1, 1, 1)});

//#endregion

//#region : Cria o player do mouse e atualiza o canvas (player e grid)

    canvas(nlayers-1).addEventListener('mousemove', (mouse) => {
        const rect = canvas(nlayers-1).getBoundingClientRect();
        const xmouse = (mouse.pageX - rect.left) * totalLine / canvas(1).width;
        const ymouse = (mouse.pageY - rect.top) * totalLine / canvas(1).height;
        ctx(1).clearRect(0, 0, canvas(1).width, canvas(1).height); // Limpa o canvas
        drawSquare(1, xmouse, ymouse, "yellow", 1, 1);

        
        drawGrid(0, totalLine, "hetero", (xmouse/(totalLine**2)) * 255, (ymouse/(totalLine**2)) * 255, (Math.sqrt(xmouse**2 + ymouse**2) / (Math.sqrt(2) * totalLine)) * 255);
    });

//#endregion
