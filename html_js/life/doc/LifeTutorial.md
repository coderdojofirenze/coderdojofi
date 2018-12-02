# HTML / Javascript - Tutorial "Life": il gioco della vita

Scopo del presente tutorial è di realizzare un versione HTML / Javascript del ["**gioco della vita**"](https://it.wikipedia.org/wiki/Gioco_della_vita)  o _life_ del matematico inglese John Conway.
Si tratta del più famoso esempio di automa cellulare: un modello matematico usato per descrivere l'evoluzione di sistemi complessi. Si rimanda alla vasta bibliografia sull'argomento per maggiori dettagli.

Qui basta sapere che nel gioco della vita si simula l'evoluzione di un insieme di cellule poste in una griglia bidimensionale. Ad ogni istante di tempo lo stato di una cellula dipende dallo stato delle celle che la circondano. I dettagli li scopriremo via via che andiamo avanti nella realizzazione.

Questo tutorial fa uso di concetti Javascript avanzati come le classi e il codice asincrono, per questo è adatto solo per chi ha già una conoscenza "robusta" di Javascript.

## Passo 1: creare una griglia con utilizzando un canvas

In questo primo passo scriveremo una pagina contenente una griglia di quadrati che costituirà la base per il nostro gioco. Per prima cosa, tramite la pagina web, chiederemo la dimensione della griglia, poi la griglia sarà costruita con le dimensioni date utilizzando un **Canvas**.

Inoltre in questa fase diamo l'impostazione al nostro progetto utilizzando file separati: uno per il foglio di stile (CSS), uno per rappresentare la pagina HTLM e uno con il codice Javascript. Creiamo quindi tre file:

* `life.css`: file con la definizione di stile. Contiene solo i colori di background e foreground da assegnare a tutti gli oggetti. Per la scelta dei colori abbiamo preso spunto al tema ["Solarized"](http://ethanschoonover.com/solarized).

```CSS
body {
    background-color: #073642;
		color: #93a1a1;
}
```

Potevamo integrarlo all'interno del file HTML, ma lasciarlo fuori ha dei vantaggi che scopriremo con l'esperienza. In generare è una buona idea separare il contenuto della pagina (file HTML) dai dati che utilizziamo per realizzarla (il file CSS) e dal codice che costituisce il motore che fa evolvere la pagina (il codice Javascript).

* `life.html`: file con la definizione pagina HTML. Lo snippet di codice riportato sotto contiene la pagina intera, con commenti per spiegare il significato delle varie sezioni. Come si vede, questa pagina include il file `life.js` che vedremo al prossimo punto e che conterrà il codice javascript che realizzerà il gioco.

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8"/>
  <!-- include lo stile sheet -->
  <link href="life.css" rel="stylesheet" type="text/css">
</head>

<!-- include lo script -->
<script type="text/javascript" src="life.js"></script>

<body>
  <!-- Questa e' l'area dove inizialmente sono specificati i parametri
       del gioco. Quando si premera' il tasto "Comincia" quest'area
       verrà nascosta e verrà visualizzata l'area successiva -->
  <div id="setup">

    <p>
      Altezza griglia (numero righe):
      <input type="text" id="altezza" size="4" value="20">
      Larghezza griglia (numero colonne):
      <input type="text" id="larghezza" size="4" value="20">
    </p>
    <p>
      <input type="button" id="VIA" value="Comincia"
      onclick="eseguiProgrammaLife(
        parseInt(document.getElementById('altezza').value),
        parseInt(document.getElementById('larghezza').value));">
    </p>
  </div>

  <!-- Questa è l'area di gioco vera e propria, il cui contenuto
       sara' costruito dalla funzione js disegnaCampo() -->
  <div id="lifegameBoard">
  </div>
</body>
</html
```
Come si vede, il `body` della pagina è diviso in due parti: un `<div>` di setup che visulizza i campi per introdurre il numero di celle della griglia (righe e colonne della matrice di gioco) e il pulsante per dare il via alla simulazione e un `<div>` principale inizialmente vuoto che verrà riempito con la griglia una volta premuto il bottone "Comincia". Questa pagina, come il file CSS non cambierà più per il resto del tutorial. Concentriamoci adesso sul vero motore del gioco.

* `life.js`: è file con il codice Javascript. In questa prima fase il codice semplicemente viene attivato alla pressione del tasto "Comincia". Si entra nella funzione `eseguiProgrammaLife()` che per il momento si limita a nascondere il `<div>` di setup e poi a costruire la griglia.

La griglia viene costruita tramite un Canvas HTML. I Canvas sono utilizzati proprio per fare grafica "al volo" su una pagina HTML. Le operazioni grafiche sono realizzate tramite funzioni javascript.

Ecco la prima versione  del file `life.js`:

```Javascript
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

```

Come si vede il core principale del gioco è costituito dalla Classe `LifeGame` istanziata da quello che a tutti gli effetti è il `main` (o entry point) del nostro programma che è la funzione `eseguiProgrammaLife`. Il costruttore della classe riceve i parametri che definiscono l'area di gioco, calcola un paio di informazioni addizionali che faranno comodo in seguito e prepara quindi il canvas con un reticolato.

Caricando la pagina `life.html` con un browser, il risultato sarà una prima pagina con i controlli per inserire i parametri della simulazione (la dimensione della griglia) e il pulsante "Comincia" che lancia lo script Javascript. La seconda pagina è il risultato della manipolazione dello script: i controlli scompaiono e compare la grid di gioco. Quello che appare è riportato nelle immagini che seguono.

La schermata con i controlli:
![I controlli per l'inserimento delle dimensioni][life_controlli]

La griglia vuota:
![La griglia vuota][life_grigliavuota]

## Passo 2: riempimento della griglia di gioco con cellule vive

Abbiamo detto che il gioco della vita simula l'evoluzione di un insieme di cellule in base ad alcune regole che vedremo successivamente.

Quello che ci serve in questa fase è preparare le strutture dati che conservano lo stato del nostro campo. Per questo ci servirà una matrice bidimensionale di dimensione pari al numero di righe per il numero di colonne del nostro campo da gioco. Se un item di questa matrice contiene il valore "1" (l'intero uno) vuol dice che in quella posizione c'è una cellula viva, altrimenti contiene 0 (zero) e vuol dire che in quella posizione non c'è una cellula.

Successivamente coloreremo il campo da gioco in modo da rispecchiare il contenuto della matrice. Dove c'è un uno coloreremo la cella di un colore vivo, altrimenti la lasceremo del colore dello sfondo.

Modifichiamo il programma `life.js` nel seguente modo:

* All'interno del costruttore, dopo aver disegnato la griglia nel canvas aggiungiamo il seguente codice, che dichiara due matrici `lifeA` e `lifeB`, inizializza la matrice A a caso e colora le celle del canvas in base a questi dati:

```Javascript
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
```
* Non preoccupatevi se la matrice `lifeB` sembra inutilizzata al momento. Capiremo più avanti perché l'abbiamo inserita. Adesso dobbiamo realizzare i tre metodi che abbiamo utilizzato qui sopra: `allocaMemoriaPerMatriciDiGioco()`, `inizializzaMatriceAACaso() `coloraCelleInBaseAMatrice()`. I the metodi vanno scritti all'interno della definizione della classe `LifeGame`:

```Javascript
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
```

Dopo tutto questo lavoro, proviamo il gioco: vedremo che una volta cliccato il tasto "Comincia" apparirà il campo da gioco con alcune celle colorate (più o meno una su quattro).

Ecco un esempio di una nuova griglia:

![La griglia popolata][life_grigliapopolata]

## Passo 3: il gioco della vita

In questo passo vediamo il gioco della vita vero e proprio.
Come abbiamo visto, si tratta di un automa cellulare in cui in ognuna delle celle del nostro tavolo da gioco ci può essere una cella viva oppure no.

La distribuzione delle cellule però evolve seguendo delle regole che dipendono dallo stato delle celle vicine. Citando [Wikipedia](https://it.wikipedia.org/wiki/Gioco_della_vita):

* Qualsiasi cella viva con meno di due celle vive adiacenti muore, come per effetto d'isolamento;
* Qualsiasi cella viva con due o tre celle vive adiacenti sopravvive alla generazione successiva;
* Qualsiasi cella viva con più di tre celle vive adiacenti muore, come per effetto di sovrappopolazione;
* Qualsiasi cella morta con esattamente tre celle vive adiacenti diventa una cella viva, come per effetto di riproduzione.

Per calcolare un'iterazione abbiamo bisogno di una seconda matrice. Questo è il motivo per cui in precedenza abbiamo inserito anche la matrice `lifeB`. Definiamo nella classe `LifeGame` una funzione per eseguire un ciclo. La chiamiamo `eseguiCiclo()`. Questo metodo utilizza una serie di altri metodi per eseguire le operazioni richieste:

```Javascript
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

```

Analizziamo il codice che abbiamo appena scritto:

* La funzione `calcolaProssimaGenerazione()` è la chiave dell'intero gioco. Partendo da una matrice contenente lo stato corrente della griglia, popola una seconda matrice con lo stato dello step successivo applicando le regole viste in precedenze. Questa funzione, il vero cuore del nostro programma, controlla una ad una tutte le celle e in base allo stato delle celle che la circondano decide lo stato successivo.

  * se la cellula è viva, valuta se deve farla morire. Per fare questa valutazione chiama la funzione `valutaMorte()`
  * se la cellula è morta, valuta se deve farla nascere. Per fare questa valutazione chiama la funzione `valutaVita()`

* Le funzioni `valutaVita()` e `valutaMorte()` fanno uso di un paio di helper che normalizzano gli indici di riga e colonna delle celle adiacenti nel caso in cui la cella sia su un bordo o ancor peggio su un angolo. Difatti ricordiamoci che vogliamo simulare un mondo toroidale, per cui, ad esempio, una cella sul lato sinistro della matrice ha delle celle adiacenti che nella rappresentazione grafica stanno al lato opposto (sull'ultima colonna a destra).

* La funzione `eseguiCiclo()`, infine, chiama la funzione `calcolaProssimaGenerazione()` alternando l'uso delle due matrici in base a quale è quella attualmente utilizzata.

A questo punto non ci rimane altro che chiamare continuamente il metodo `eseguiCiclo()` dalla nostra funzione principale `eseguiProgrammaLife()`. Per evitare che il gioco corra troppo veloce dobbiamo però fare in modo che tra un'iterazione e l'altra del gioco il sistema attenda un po' di tempo (dicamo 200 milli secondi). Per fare questo dobbiamo utilizzare codice asincrono.

* Aggiungiamo la seguente chiamata nella parte finale della funzione `eseguiProgrammaLife()`:

```Javascript
cicloPrincipale(lifeGame);
```

* e implementiamo questa funzione nel seguente modo:

```Javascript
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
```

Anche se sono poche righe di codice, questa è la parte forse più complicata del tutorial dal punto di vista della "teoria" di Javascript. Chiedete ai mentor delucidazioni sul codice asincrono!

## Possibili estensioni

L'estensione ovvia è fare in modo di simulare alcuni campi di partenza che contengano delle configurazioni predefinite che ci permettano di esplorare il comportamento dell'algoritmo della vita. Per alcune di queste configurazioni si rimanda alla [**pagina di Wikipedia in inglese**](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

Per fare questo si possono per esempio seguire i seguenti passi:
 * aggiungere dei radio button che permettano di specificare la configurazione di partenza nella pagina di setup,
 * nella funzione principale `eseguiProgrammaLife()` determinare quale radio button è selezionato
 * il tipo di campo selezionato deve essere passato al costruttore della classe `LifeGame` e a questa devono essere aggiunti dei metodi per inizializzare il campo in modo diverso da quello casuale. Il metodo di inizializzazione appropriato sarà chiamato in base al radio button selezionato.
 * Per il resto il cuore del gioco (la parte di calcolo dei cicli) ovviamente non cambia.

 Vedere il codice contenuto in `passo4` per una possibile implementazione. .

## Credits

Questo tutorial è stato realizzato dai mentor del Coderdojo di Firenze. Il tutorial e il codice sorgente del programma possono essere scaricati dall'area delle risorse del sito del Coderdojo di firenze, all'URL:

[**https://firenze.coderdojo.it/risorse/**](https://firenze.coderdojo.it/risorse/)

Tutto il codice prodotto dal Coderdojo di Firenze per l'uso è anche liberamente disponibile nel seguente repository su Github:

[**https://github.com/coderdojofirenze/coderdojofi**](https://github.com/coderdojofirenze/coderdojofi)

Il codice di questo tutorial è in particolare disponibile al seguente link:

[**https://github.com/coderdojofirenze/coderdojofi/tree/master/html_js/life**](https://github.com/coderdojofirenze/coderdojofi/tree/master/html_js/life)
[life_controlli]: assets/imgs/life_controlli.png
[life_grigliavuota]: assets/imgs/life_grigliavuota.png
[life_grigliapopolata]: assets/imgs/life_grigliapopolata.png
