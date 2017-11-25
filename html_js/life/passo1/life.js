// Variabili globali
var c = document.createElement("canvas");
var ctx = c.getContext("2d");
var cellsize = 10;

var numeroRighe;
var numeroColonne;

// -----------------------------------------------------------------------------
// Programma principale chiamato alla pressione del pulsante "Comincia"
//  per il momento semplicemente nasconde i campi per il setup e disegna il
// campo vuoto
function eseguiProgrammaLife(nrows, ncols)
{
  // salva il numero di righe e di colonne in due variabili
  // globali che saranno utilizzate nel seguito dal resto del Programma
  numeroRighe = parseInt(nrows);
  numeroColonne = parseInt(ncols);

  // nasconde i campi per la lettura delle dimensioni del campo
  MostraNascondi('N');

  // disegna il campo di gioco
  preparaCanvas();
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
function preparaCanvas()
{
  div = document.getElementById("lifegameBoard");
  c.width = (cellsize + 1) * numeroColonne + 2;
  c.height = (cellsize + 1) * numeroRighe + 2;

  ctx.beginPath();
  disegnaCampo("#657b83")
  ctx.stroke();
  div.appendChild(c);
}

// -----------------------------------------------------------------------------
function disegnaCampo(color)
{
  var cellfullsize = cellsize + 1;
  var sizetotalx = cellfullsize * numeroColonne;
  var sizetotaly = cellfullsize * numeroRighe;

  for (var row = 0, currenty = 1; row <= numeroRighe; row++, currenty += cellfullsize)
  {
    ctx.moveTo(1, currenty);
    ctx.lineTo(1 + sizetotalx, currenty);
  }
  for (var col = 0, currentx = 1; col <= numeroColonne; col++, currentx += cellfullsize)
  {
    ctx.moveTo(currentx, 1);
    ctx.lineTo(currentx, 1 + sizetotaly);
  }
  ctx.strokeStyle = color;

}
