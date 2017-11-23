// Variabili globali
var c = document.createElement("canvas");
var ctx = c.getContext("2d");
var cellsize = 10;

var cellAliveColor = "#cb4b16";
var cellDeadColor = "#073642";

var lifeA = [];   // <--- aggiunta al passo 3
var lifeB = [];   // <--- aggiunta al passo 3

// -----------------------------------------------------------------------------
// Programma principale chiamato alla pressione del pulsante "Comincia"
//  per il momento semplicemente nasconde i campi per il setup e disegna il
// campo vuoto
function eseguiProgrammaLife(nrows, ncols)
{
  preparaMatrici(nrows, ncols);   // <-- nuovo in passo 3
  MostraNascondi('N');
  disegnaCampo(nrows, ncols);

  lifeStart(nrows, ncols);                        // <-- nuovo in passo 3
  coloraCelleInBaseAMatrice(lifeA, nrows, ncols); // <-- nuovo in passo 3
}

// -----------------------------------------------------------------------------
// Serve per mostrare e nascondere gli item per inserire
// le informazioni del campo da creare
function MostraNascondi(x)
{
  if (x=='N') document.getElementById('setup').style.display='none';
  else document.getElementById('setup').style.display='block';
}

// -----------------------------------------------------------------------------
// Disegna il campo con le dimensioni date
function disegnaCampo(nrows, ncols)
{
  div = document.getElementById("lifegameBoard");
  c.width = (cellsize + 1) * ncols + 2;
  c.height = (cellsize + 1) * nrows + 2;

  ctx.beginPath();
  drawGrid(nrows, ncols, "#657b83")
  ctx.stroke();
  div.appendChild(c);

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
// FINE CODICE PASSO 1

// *****************************************************************************
// DA QUI IN POI IL CODICE NUOVO DEL PASSO 2
// -----------------------------------------------------------------------------
function fillCell(i, j, color)
{
  var cellfullsize = cellsize + 1;
  var cellstartx = (j*cellfullsize)+2;
  var cellstarty = (i*cellfullsize)+2;

  ctx.fillStyle = color;
  ctx.fillRect(cellstartx, cellstarty, 9, 9);
}

function cellAlive(i,j) { fillCell(i, j, cellAliveColor); }
function cellDead(i,j) { fillCell(i, j, cellDeadColor); }

// *****************************************************************************
// DA QUI IN POI IL CODICE NUOVO DEL PASSO 3
// -----------------------------------------------------------------------------
function preparaMatrici(nrows, ncols)
{
  for (var row = 0; row < nrows; row++)
  {
    lifeA[row] = new Array(ncols);
    lifeB[row] = new Array(ncols);
  }
}

// -----------------------------------------------------------------------------

function lifeStart(nrows, ncols)
{
  // riempie lifeA[][] di 0 e 1 a caso
  //    0 significa cella morta
  //    1 significa cella viva
  for (var row = 0; row < nrows; row++)
  {
    for (var col = 0; col < ncols; col++)
    {
      if (Math.random() >= 0.5)
        lifeA[row][col] = 1;
      else
        lifeA[row][col] = 0;
    }
  }
}

// -----------------------------------------------------------------------------
function coloraCelleInBaseAMatrice(mtx, nrows, ncols)
{
  ctx.beginPath();
  for (var row = 0; row < nrows; row++)
  {
    for (var col = 0; col < ncols; col++)
    {
      if (mtx[row][col] != 0)
        cellAlive(row, col);
    }
  }
  div.appendChild(c);
}
