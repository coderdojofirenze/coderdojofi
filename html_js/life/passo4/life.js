// Definizione della classe per il "Life Game"
class LifeGame  {
  // modificato al passo 4 per aggiungere tipoCampo
  constructor (canvas, numeroRighe, numeroColonne, dimensioneCella,
       coloreSfondo, coloreReticolato, coloreCelleVive, tipoCampo) {
    this.canvas = canvas;
    this.numeroRighe = numeroRighe;
    this.numeroColonne = numeroColonne;
    this.dimensioneCella = dimensioneCella;
    this.coloreSfondo = coloreSfondo;
    this.coloreReticolato = coloreReticolato;
    this.coloreCelleVive = coloreCelleVive;
    this.tipoCampo = tipoCampo;          // <---- passo 4

    // salva per praticita' il contesto 2D dove verranno effettuate
    // le operazioni grafiche
    this.ctx2d = this.canvas.getContext("2d");

    // salva per praticita' la dimensione reale della cella
    // tenendo anche conto del bordo
    this.dimCellaReale = this.dimensioneCella + 1;

    this.preparaCanvas();

    // ------------------ INIZIO CODICE NUOVO PASSO 2 --------------------
    // dopo la preparazione del Canvas siamo pronti per riempire
    // il campo di gioco con una "coltura" generata a caso
    this.lifeA = [];  // <---- passo 2
    this.lifeB = [];  // <---- passo 2
    this.allocaMemoriaPerMatriciDiGioco();      // <---- passo 2
    this.inizializzaMatriceA();            // <---- passo 2 (modificato al passo 4)
    this.coloraCelleInBaseAMatrice(this.lifeA); // <---- passo 2
    this.matriceAttiva = 'A';
    // ------------------- FINE CODICE NUOVO PASSO 2 ---------------------
  }

  // Disegna il campo con le dimensioni date
  preparaCanvas() {
    this.canvas.width = (this.dimensioneCella + 1) * this.numeroColonne + 2;
    this.canvas.height = (this.dimensioneCella + 1) * this.numeroRighe + 2;

    this.ctx2d.beginPath();
    this.disegnaCampo();
    this.ctx2d.stroke();
  }
  disegnaCampo() {
    const sizetotalx = this.dimCellaReale * this.numeroColonne;
    const sizetotaly = this.dimCellaReale * this.numeroRighe;

    for (var row = 0, currenty = 1; row <= this.numeroRighe; row++, currenty += this.dimCellaReale)
    {
      this.ctx2d.moveTo(1, currenty);
      this.ctx2d.lineTo(1 + sizetotalx, currenty);
    }
    for (var col = 0, currentx = 1; col <= this.numeroColonne; col++, currentx += this.dimCellaReale)
    {
      this.ctx2d.moveTo(currentx, 1);
      this.ctx2d.lineTo(currentx, 1 + sizetotaly);
    }
    this.ctx2d.strokeStyle = this.coloreReticolato;
  }

  // -------------------------------------------------------------------
  // ------------------ INIZIO CODICE NUOVO PASSO 2 --------------------
  allocaMemoriaPerMatriciDiGioco() {
    for (var row = 0; row < this.numeroRighe; row++)
    {
      this.lifeA[row] = new Array(this.numeroColonne);
      this.lifeB[row] = new Array(this.numeroColonne);
    }
    this.pulisciMatrici();
  }

  pulisciMatrici() {
    for (var row = 0; row < this.numeroRighe; row++)
    {
      for (var col = 0; col < this.numeroColonne; col++)
      {
        this.lifeA[row][col] = 0;
        this.lifeB[row][col] = 0;
      }
    }
  }

  inizializzaMatriceAACaso() {
    // riempie mtx[][] di 0 e 1 a caso
    //    0 significa cella morta
    //    1 significa cella viva
    for (var row = 0; row < this.numeroRighe; row++)
    {
      for (var col = 0; col < this.numeroColonne; col++)
      {
        // Random ritorna un numero da 0 a 1
        // noi vogliamo più o meno una cella viva ogni quattro
        if (Math.random() >= 0.75)
          this.lifeA[row][col] = 1;
      }
    }
  }

  coloraCelleInBaseAMatrice(mtx) {
    this.ctx2d.beginPath();
    for (var row = 0; row < this.numeroRighe; row++)
    {
      for (var col = 0; col < this.numeroColonne; col++)
      {
        if (mtx[row][col] != 0) {
          this.cellaViva(row, col);
        }
        else
          this.cellaMorta(row, col);
      }
    }
  }

  cellaViva(i,j) { this.coloraCella(i, j, this.coloreCelleVive); }
  cellaMorta(i,j) { this.coloraCella(i, j, this.coloreSfondo); }

  coloraCella(i, j, color)
  {
    const cellstartx = (j * this.dimCellaReale) + 2;
    const cellstarty = (i * this.dimCellaReale) + 2;

    this.ctx2d.fillStyle = color;
    this.ctx2d.fillRect(cellstartx, cellstarty,
         this.dimensioneCella - 1, this.dimensioneCella - 1);
  }
  // ------------------- FINE CODICE NUOVO PASSO 2 ---------------------
  // -------------------------------------------------------------------

  // -------------------------------------------------------------------
  // ------------------ INIZIO CODICE NUOVO PASSO 3 --------------------
  eseguiCiclo() {
    if (this.matriceAttiva === 'A') {
      this.calcolaProssimaGenerazione(this.lifeA, this.lifeB);
      this.coloraCelleInBaseAMatrice(this.lifeB);
      this.matriceAttiva = 'B';
    }
    else {
      this.calcolaProssimaGenerazione(this.lifeB, this.lifeA);
      this.coloraCelleInBaseAMatrice(this.lifeA);
      this.matriceAttiva = 'A';
    }
  }

  calcolaProssimaGenerazione(oldmtx, newmtx) {
    for (var row = 0; row < this.numeroRighe; row++)
    {
      for (var col = 0; col < this.numeroColonne; col++)
      {
        if (oldmtx[row][col] == 1)
        {
          if (this.valutaMorte(oldmtx, row, col))
            newmtx[row][col] = 0;
          else
            newmtx[row][col] = 1;
        }
        else
        {
          if (this.valutaVita(oldmtx, row, col))
            newmtx[row][col] = 1;
          else
            newmtx[row][col] = 0;
        }
      }
    }
  }

  valutaMorte(mtx, row, col)
  {
    var i, j;
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
        if (mtx[this.normalizzaRiga(row + i)][this.normalizzaColonna(col + j)]) {
          ++liveCount;
          if (liveCount > 3) return true;
        }
      }
    }
    if (liveCount < 2) return true;
    return false;
  }

  valutaVita(mtx, row, col)
  {
    var i, j;
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
        if (mtx[this.normalizzaRiga(row + i)][this.normalizzaColonna(col + j)]) {
          ++liveCount;
        }
        // --------------------------------------
      }
    }
    if (liveCount == 3) return true;
    return false;
  }

  // Queste funzioni servono per simulare la geometria di un toroide.
  normalizzaRiga(row)
  {
    if (row < 0)
      return this.numeroRighe + row;
    else
      return row % this.numeroRighe;
  }
  normalizzaColonna(col)
  {
    if (col < 0)
      return this.numeroColonne + col;
    else
      return col % this.numeroColonne;
  }
  // ------------------- FINE CODICE NUOVO PASSO 3 ---------------------
  // -------------------------------------------------------------------

  // -------------------------------------------------------------------
  // ------------------ INIZIO CODICE NUOVO PASSO 4 --------------------
  inizializzaMatriceA() {
    if (this.tipoCampo == 'casuale')
    {
      // colora un po' di celle a casaccio
      this.inizializzaMatriceAACaso();
    }
    else if (this.tipoCampo == 'alianti')
    {
      // prepara un campo di alianti
      this.inizializzaMatriceAConAlianti();
    }
    else if (this.tipoCampo == 'astronavi')
    {
      // prepara un campo di astronavi leggere
      this.inizializzaMatriceAConAstronavi();
    }
    else if (this.tipoCampo == 'oscillatori')
    {
      // prepara un campo con oscillatori
      this.inizializzaMatriceAConOscillatori();
    }
  }

  inizializzaMatriceAConAlianti()
  {
    for (var row = 0; row <= this.numeroRighe-10; row += 10)
    {
      for (var col = 0; col <= this.numeroColonne-10; col += 10)
      {
        this.lifeA[row][col+1] = 1;
        this.lifeA[row+1][col+2] = 1;
        this.lifeA[row+2][col+0] = 1;
        this.lifeA[row+2][col+1] = 1;
        this.lifeA[row+2][col+2] = 1;
      }
    }
  }

  inizializzaMatriceAConAstronavi()
  {
    for (var row = 2; row <= this.numeroRighe-7; row += 10)
    {
      for (var col = 0; col <= this.numeroColonne-10; col += 11)
      {
        this.lifeA[row][col] = 1;
        this.lifeA[row][col+3] = 1;
        this.lifeA[row+1][col+4] = 1;
        this.lifeA[row+2][col+0] = 1;
        this.lifeA[row+2][col+4] = 1;
        this.lifeA[row+3][col+1] = 1;
        this.lifeA[row+3][col+2] = 1;
        this.lifeA[row+3][col+3] = 1;
        this.lifeA[row+3][col+4] = 1;
      }
    }
  }

  inizializzaMatriceAConOscillatori()
  {
    this.lifeA[6][4] = 1;
    this.lifeA[7][4] = 1;
    this.lifeA[8][4] = 1;

    this.lifeA[6][17] = 1;
    this.lifeA[6][18] = 1;
    this.lifeA[6][19] = 1;
    this.lifeA[7][16] = 1;
    this.lifeA[7][17] = 1;
    this.lifeA[7][18] = 1;

    this.lifeA[5][28] = 1;
    this.lifeA[5][29] = 1;
    this.lifeA[6][28] = 1;
    this.lifeA[6][29] = 1;
    this.lifeA[7][30] = 1;
    this.lifeA[7][31] = 1;
    this.lifeA[8][30] = 1;
    this.lifeA[8][31] = 1;

    this.lifeA[3][40] = 1;
    this.lifeA[3][41] = 1;
    this.lifeA[3][42] = 1;
    this.lifeA[3][46] = 1;
    this.lifeA[3][47] = 1;
    this.lifeA[3][48] = 1;
    this.lifeA[5][38] = 1;
    this.lifeA[5][43] = 1;
    this.lifeA[5][45] = 1;
    this.lifeA[5][50] = 1;
    this.lifeA[6][38] = 1;
    this.lifeA[6][43] = 1;
    this.lifeA[6][45] = 1;
    this.lifeA[6][50] = 1;
    this.lifeA[7][38] = 1;
    this.lifeA[7][43] = 1;
    this.lifeA[7][45] = 1;
    this.lifeA[7][50] = 1;
    this.lifeA[8][40] = 1;
    this.lifeA[8][41] = 1;
    this.lifeA[8][42] = 1;
    this.lifeA[8][46] = 1;
    this.lifeA[8][47] = 1;
    this.lifeA[8][48] = 1;
    this.lifeA[10][40] = 1;
    this.lifeA[10][41] = 1;
    this.lifeA[10][42] = 1;
    this.lifeA[10][46] = 1;
    this.lifeA[10][47] = 1;
    this.lifeA[10][48] = 1;
    this.lifeA[11][38] = 1;
    this.lifeA[11][43] = 1;
    this.lifeA[11][45] = 1;
    this.lifeA[11][50] = 1;
    this.lifeA[12][38] = 1;
    this.lifeA[12][43] = 1;
    this.lifeA[12][45] = 1;
    this.lifeA[12][50] = 1;
    this.lifeA[13][38] = 1;
    this.lifeA[13][43] = 1;
    this.lifeA[13][45] = 1;
    this.lifeA[13][50] = 1;
    this.lifeA[15][40] = 1;
    this.lifeA[15][41] = 1;
    this.lifeA[15][42] = 1;
    this.lifeA[15][46] = 1;
    this.lifeA[15][47] = 1;
    this.lifeA[15][48] = 1;

    this.lifeA[23][25] = 1;
    this.lifeA[24][25] = 1;
    this.lifeA[25][24] = 1;
    this.lifeA[25][26] = 1;
    this.lifeA[26][25] = 1;
    this.lifeA[27][25] = 1;
    this.lifeA[28][25] = 1;
    this.lifeA[29][25] = 1;
    this.lifeA[30][24] = 1;
    this.lifeA[30][26] = 1;
    this.lifeA[31][25] = 1;
    this.lifeA[32][25] = 1;
  }
  // ------------------- FINE CODICE NUOVO PASSO 4 ---------------------
  // -------------------------------------------------------------------
}


// -----------------------------------------------------------------------------
// Programma principale chiamato alla pressione del pulsante "Comincia"
function eseguiProgrammaLife(nRighe, nColonne)
{
  // nasconde i campi per la lettura delle dimensioni del campo
  MostraNascondi('N');

  // Crea il Canvas dove verrà mostrato il Gioco della Vita
  let canvas = document.createElement("canvas");

  // ------------------ INIZIO CODICE NUOVO PASSO 4 --------------------
  var tipoCampo = document.querySelector('input[name="tipocampo"]:checked').value;
  if (tipoCampo !== 'casuale')
  {
    // Per i tipi di campo diversi dal "casuale" la dimensione è prestabilita
    nRighe = 40;
    nColonne = 60;
  }
  // ------------------- FINE CODICE NUOVO PASSO 4 ---------------------

  // Crea l'oggetto base per gestire il "Gioco della vita".
  // Al costruttore dell'oggetto vengono passati i seguenti argomenti:
  //   - canvas: il canvas dove il gioco deve essere disegnato
  //   - nRighe: il numero di righe della "coltura" (come da parametro)
  //   - nColonne: il numero di colonne dell "coltura" (come da parametro)
  //   - 10: la dimensione delle celle
  //   - il colore dello sfondo
  //   - il colore del reticolato
  //   - il colore delle celle vive
  //   - it tipo del campo, che puo' assumere uno dei seguenti valori:
  //      - 'casuale'
  //      - 'alianti'
  //      - 'astronavi'
  //      - 'oscillatori'
  let lifeGame = new LifeGame(canvas, nRighe, nColonne, 10,
       "#073642", "#657b83", "#cb4b16", tipoCampo);

  // dopo la creazione del gioco, il canvas e' pronto per
  // essere mostrato a schermo:
  document.getElementById("lifegameBoard").appendChild(canvas);

  cicloPrincipale(lifeGame);
}

async function cicloPrincipale(lifeGame) {
  while (1) {
    await sleep(200)
    lifeGame.eseguiCiclo();
    console.log('ciclo eseguito...');
  }
}

// usa await/promise per attendere il tempo specificato. Vedi:
//   https://ponyfoo.com/articles/es6-promises-in-depth
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// -----------------------------------------------------------------------------
// Serve per mostrare e nascondere gli item per inserire
// le informazioni del campo da creare
function MostraNascondi(x)
{
  if (x=='N') document.getElementById('setup').style.display='none';
  else document.getElementById('setup').style.display='block';
}

