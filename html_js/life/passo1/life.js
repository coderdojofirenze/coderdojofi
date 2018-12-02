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

