// Variabili globali
var c = document.createElement("canvas");
var ctx = c.getContext("2d");
var cellsize = 10;

var cellAliveColor = "#cb4b16";
var cellDeadColor = "#073642";


// -----------------------------------------------------------------------------
// Serve per mostrare e nascondere gli item per inserire
// le informazioni del campo da creare
function MostraNascondi(x)
{
  if (x=='N') document.getElementById('setup').style.display='none';
  else document.getElementById('setup').style.display='block';
}

// -----------------------------------------------------------------------------
function drawGrid(nrows, ncols, color)
{
  var cellfullsize = cellsize + 1;
  var sizetotalx = cellfullsize * ncols;
  var sizetotaly = cellfullsize * nrows;

  for (var row = 0, currenty = 1; row <= nrows; row++, currenty += cellfullsize)
  {
    ctx.moveTo(1, currenty);
    ctx.lineTo(1 + sizetotalx, currenty);
  }
  for (var col = 0, currentx = 1; col <= ncols; col++, currentx += cellfullsize)
  {
    ctx.moveTo(currentx, 1);
    ctx.lineTo(currentx, 1 + sizetotaly);
  }
  ctx.strokeStyle = color;

}

// -----------------------------------------------------------------------------
// NUOVO IN PASSO 2
function fillCell(i, j, color)
{
  var cellfullsize = cellsize + 1;
  var cellstartx = (i*cellfullsize)+2;
  var cellstarty = (j*cellfullsize)+2;

  ctx.fillStyle = color;
  ctx.fillRect(cellstartx, cellstarty, 9, 9);
}

function cellAlive(i,j) { fillCell(i, j, cellAliveColor); }
function cellDead(i,j) { fillCell(i, j, cellDeadColor); }

// For promises, read:
//   https://ponyfoo.com/articles/es6-promises-in-depth
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// -----------------------------------------------------------------------------
// Disegna il campo con le dimensioni date
async function disegnaCampo(nrows, ncols)
{
  MostraNascondi('N');
  div = document.getElementById("lifegameBoard");
  c.width = (cellsize + 1) * ncols + 2;
  c.height = (cellsize + 1) * nrows + 2;

  ctx.beginPath();
  drawGrid(nrows, ncols, "#657b83")
  ctx.stroke();
  div.appendChild(c);

  // NUOVO IN PASSO 2
  while (1) {
    await sleep(1000);

    ctx.beginPath();
    cellAlive(0, 0);
    cellAlive(1, 1);
    cellAlive(2, 2);
    cellAlive(3, 3);
    cellAlive(4, 4);
    cellAlive(5, 5);
    cellAlive(6, 6);
    cellAlive(7, 6);
    cellAlive(8, 6);
    cellAlive(9, 6);
    ctx.stroke();
    div.appendChild(c);

    await sleep(1000);
    ctx.beginPath();
    cellDead(0, 0);
    cellDead(1, 1);
    cellDead(2, 2);
    cellDead(3, 3);
    cellDead(4, 4);
    cellDead(5, 5);
    cellDead(6, 6);
    cellDead(7, 6);
    cellDead(8, 6);
    cellDead(9, 6);
    ctx.stroke();
    div.appendChild(c);
  }

}
