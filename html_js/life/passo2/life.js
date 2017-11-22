// Variabili globali
var c = document.createElement("canvas");
var ctx = c.getContext("2d");
var cellsize = 10;

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
function fillCell(i, j, color)
{
  var cellfullsize = cellsize + 1;
  var cellstartx = (i*cellfullsize)+2;
  var cellstarty = (j*cellfullsize)+2;

  ctx.fillStyle = color;
  ctx.fillRect(cellstartx, cellstarty, 9, 9);
}


// -----------------------------------------------------------------------------
// Disegna il campo con le dimensioni date
function disegnaCampo(nrows, ncols)
{
  MostraNascondi('N');
  div = document.getElementById("lifegameBoard");
  c.width = (cellsize + 1) * ncols + 2;
  c.height = (cellsize + 1) * nrows + 2;

  ctx.beginPath();
  drawGrid(nrows, ncols, "#657b83")
  ctx.stroke();
  div.appendChild(c);

  setTimeout(function() {
    ctx.beginPath();
    fillCell(0, 0, "#cb4b16")
    fillCell(1, 1, "#cb4b16")
    fillCell(2, 2, "#cb4b16")
    fillCell(3, 3, "#cb4b16")
    fillCell(4, 4, "#cb4b16")
    fillCell(5, 5, "#cb4b16")
    fillCell(6, 6, "#cb4b16")
    fillCell(7, 6, "#cb4b16")
    fillCell(8, 6, "#cb4b16")
    fillCell(9, 6, "#cb4b16")
    ctx.stroke();
    div.appendChild(c);
  }, 3000);

}
