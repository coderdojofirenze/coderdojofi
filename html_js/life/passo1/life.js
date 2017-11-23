// Variabili globali
var c = document.createElement("canvas");
var ctx = c.getContext("2d");
var cellsize = 10;

// -----------------------------------------------------------------------------
// Programma principale chiamato alla pressione del pulsante "Comincia"
//  per il momento semplicemente nasconde i campi per il setup e disegna il
// campo vuoto
function eseguiProgrammaLife(nrows, ncols)
{
  MostraNascondi('N');
  disegnaCampo(nrows, ncols);
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
// Disegnol campo con le dimensioni date
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
