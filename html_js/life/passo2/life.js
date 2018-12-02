// Definizione della classe per il "Life Game"
class LifeGame  {
  constructor (canvas, numeroRighe, numeroColonne, dimensioneCella,
       coloreSfondo, coloreReticolato, coloreCelleVive) {
    this.canvas = canvas;
    this.numeroRighe = numeroRighe;
    this.numeroColonne = numeroColonne;
    this.dimensioneCella = dimensioneCella;
    this.coloreSfondo = coloreSfondo;
    this.coloreReticolato = coloreReticolato;
    this.coloreCelleVive = coloreCelleVive;

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
    this.inizializzaMatriceAACaso();            // <---- passo 2
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
}


// -----------------------------------------------------------------------------
// Programma principale chiamato alla pressione del pulsante "Comincia"
function eseguiProgrammaLife(nRighe, nColonne)
{
  // nasconde i campi per la lettura delle dimensioni del campo
  MostraNascondi('N');

  // Crea il Canvas dove verrà mostrato il Gioco della Vita
  let canvas = document.createElement("canvas");

  // Crea l'oggetto base per gestire il "Gioco della vita".
  // Al costruttore dell'oggetto vengono passati i seguenti argomenti:
  //   - canvas: il canvas dove il gioco deve essere disegnato
  //   - nRighe: il numero di righe della "coltura" (come da parametro)
  //   - nColonne: il numero di colonne dell "coltura" (come da parametro)
  //   - 10: la dimensione delle celle
  //   - il colore dello sfondo
  //   - il colore del reticolato
  //   - il colore delle celle vive
  let lifeGame = new LifeGame(canvas, nRighe, nColonne, 10,
       "#073642", "#657b83", "#cb4b16");

  // dopo la creazione del gioco, il canvas e' pronto per
  // essere mostrato a schermo:
  document.getElementById("lifegameBoard").appendChild(canvas);
}

// -----------------------------------------------------------------------------
// Serve per mostrare e nascondere gli item per inserire
// le informazioni del campo da creare
function MostraNascondi(x)
{
  if (x=='N') document.getElementById('setup').style.display='none';
  else document.getElementById('setup').style.display='block';
}

