// Variabili globali
var c = document.createElement("canvas");
var ctx = c.getContext("2d");
var cellsize = 10;

var numeroRighe;
var numeroColonne;

var lifeA = [];                   // <-- aggiunta al passo 2
var lifeB = [];                   // <-- aggiunta al passo 3

var cellAliveColor = "#cb4b16";   // <-- aggiunta al passo 2
var cellDeadColor = "#073642";    // <-- aggiunta al passo 2


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

  // Prepara la matrice Life
  allocaMemoriaPerMatrice(lifeA);         // <-- aggiunta al passo 2
  allocaMemoriaPerMatrice(lifeB);         // <-- aggiunta al passo 3

  // colora un po' di celle a casaccio
  inizializzaMatriceLifeACaso(lifeA);     // <-- aggiunta al passo 2
  coloraCelleInBaseAMatrice(lifeA);       // <-- aggiunta al passo 2


  // Codice nuovo inserito nel passo 3 ----------
  // Ciclo principale
  eseguiCicloDellaVita();

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
// FINE CODICE PASSO 1

// *****************************************************************************
// DA QUI IN POI IL CODICE NUOVO DEL PASSO 2
// -----------------------------------------------------------------------------
function allocaMemoriaPerMatrice(mtx)
{
  for (var row = 0; row < numeroRighe; row++)
  {
    mtx[row] = new Array(numeroColonne);
  }
}

// -----------------------------------------------------------------------------
function inizializzaMatriceLifeACaso(mtx)
{
  // riempie mtx[][] di 0 e 1 a caso
  //    0 significa cella morta
  //    1 significa cella viva
  for (var row = 0; row < numeroRighe; row++)
  {
    for (var col = 0; col < numeroColonne; col++)
    {
      // Random ritorna un numero da 0 a 1
      // noi vogliamo più o meno una cella viva ogni quattro
      if (Math.random() >= 0.75)
        mtx[row][col] = 1;
      else
        mtx[row][col] = 0;
    }
  }
}

// -----------------------------------------------------------------------------
function coloraCelleInBaseAMatrice(mtx)
{
  ctx.beginPath();
  for (var row = 0; row < numeroRighe; row++)
  {
    for (var col = 0; col < numeroColonne; col++)
    {
      if (mtx[row][col] != 0)
        cellAlive(row, col);
      else
        cellDead(row, col);
    }
  }
  div.appendChild(c);
}

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
// For promises, read:
//   https://ponyfoo.com/articles/es6-promises-in-depth
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// -----------------------------------------------------------------------------
async function eseguiCicloDellaVita(nrows, ncols)
{
  while (1)
  {
    await sleep(200);
    calcolaProssimaGenerazione(lifeA, lifeB);
    coloraCelleInBaseAMatrice(lifeB);
    await sleep(200);
    calcolaProssimaGenerazione(lifeB, lifeA);
    coloraCelleInBaseAMatrice(lifeA);
  }
}

// -----------------------------------------------------------------------------
function calcolaProssimaGenerazione(oldmtx, newmtx)
{
  for (var row = 0; row < numeroRighe; row++)
  {
    for (var col = 0; col < numeroColonne; col++)
    {
      if (oldmtx[row][col] == 1)
      {
        if (valutaMorte(oldmtx, row, col))
          newmtx[row][col] = 0;
        else
          newmtx[row][col] = 1;
      }
      else
      {
        if (valutaVita(oldmtx, row, col))
          newmtx[row][col] = 1;
        else
          newmtx[row][col] = 0;
      }
    }
  }
}

// -----------------------------------------------------------------------------
function valutaMorte(mtx, row, col)
{
  var liveCount = 0;
  // valuta se una cella viva deve morire in base al suo intorno
  // Qualsiasi cella viva:
  //   - Se ha intorno a se meno di due celle, muore
  //   - se ha intorno a se più di tre celle vive adiacenti, muore
  for (i = -1; i <= 1; i++) {
    for (j = -1; j <= 1; j++){

      // non considera se stesso
      if ((i == 0) && (j == 0))
        continue;

      // simula la geometria di un toroide ----
      if (mtx[normalizzaRiga(row + i)][normalizzaColonna(col + j)]) {
        ++liveCount;
        if (liveCount > 3) return true;
      }
      // --------------------------------------
    }
  }

  if (liveCount < 2) return true;
  return false;
}


// -----------------------------------------------------------------------------
function valutaVita(mtx, row, col)
{
  var liveCount = 0;
  // valuta se una cella vuota (morta) deve popolarsi in base al suo intorno
  // Qualsiasi cella morta:
  //   - Se ha intorno a se esattamente tre celle vive, nasce
  for (i = -1; i <= 1; i++) {
    for (j = -1; j <= 1; j++){

      // non considera se stesso
      if ((i == 0) && (j == 0))
        continue;

      // simula la geometria di un toroide ----
      if (mtx[normalizzaRiga(row + i)][normalizzaColonna(col + j)]) {
        ++liveCount;
      }
      // --------------------------------------
    }
  }
  if (liveCount == 3) return true;
  return false;
}

// Queste funzioni servono per simulare la geometria di un toroide.
// Sapreste spiegare perché?
// -----------------------------------------------------------------------------
function normalizzaRiga(row)
{
  if (row < 0)
    return numeroRighe + row;
  else
    return row % numeroRighe;
}

// -----------------------------------------------------------------------------
function normalizzaColonna(col)
{
  if (col < 0)
    return numeroColonne + col;
  else
    return col % numeroColonne;
}
