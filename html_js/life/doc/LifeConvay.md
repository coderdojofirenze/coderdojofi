# Coderdojo di Firenze - HTML / Javascript - Tutorial Life

Scopo del presente tutorial è di realizzare un versione HTML / Javascript del ["**gioco della vita**"](https://it.wikipedia.org/wiki/Gioco_della_vita)  o _life_ del matematico inglese John Conway.
Si tratta del più famoso esempio di automa cellulare: un modello matematico usato per descrivere l'evoluzione di sistemi complessi. Si rimanda alla vasta bibliografia sull'argomento per maggiori dettagli.

Qui basta sapere che l'automa life... **FIXME --- TO BE COMPLETED**

## Passo 1: creare una griglia con utilizzando un canvas

In questo primo passo scriveremo una pagina contenente una griglia di quadrati che costituirà la base per il nostro gioco. Per prima cosa, tramite la pagina web, chiederemo la dimensione della griglia, poi la griglia sarà costruita con le dimensioni date utilizzando un **Canvas**.

Inoltre in questa fase diamo l'impostazione al nostro progetto utilizzando file separati: uno per il foglio di stile (CSS), uno per rappresentare la pagina HTLM e uno con il codice Javascript. Creiamo quindi tre file:

* `life.css`: file con la definizione di stile. Per il momento contiene solo i colori di background e foreground da assegnare a tutti gli oggetti. Per la scelta dei colori abbiamo preso spunto al tema ["Solarized"](http://ethanschoonover.com/solarized).

```CSS
body {
    background-color: #073642;
		color: #93a1a1;
}
```

* `life.html`: file con la definizione pagina HTML. Lo snippet di codice riportato sotto contiene la pagina intera, con commenti per spiegare il significato delle varie sezioni. Come si vede, questa pagina include il file `life.js` che vedremo al prossimo punto e che conterrà il codice javascript che realizzerà il gioco.

```html
<html>
<head>
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
    </p>
    <p>
      Larghezza griglia (numero colonne):
       <input type="text" id="larghezza" size="4" value="20">
    </p>
    <p>
      <input type="button" id="VIA" value="Comincia"
        onclick="eseguiProgrammaLife(document.getElementById('altezza').value,
        document.getElementById('larghezza').value);">
    </p>
  </div>

  <!-- Questa è l'area di gioco vera e propria, il cui contenuto
       sara' costruito dalla funzione js disegnaCampo() -->
  <div id="lifegameBoard">
  </div>
</body>
</html>
```
Come si vede, il `body` della pagina è diviso in due parti: un `<div>` di setup che visulizza i campi per introdurre il numero di celle della griglia (righe e colonne della matrice di gioco) e il pulsante per dare il via alla simulazione e un `<div>` principale inizialmente vuoto che verrà riempito con la griglia una volta premuto il bottone "Comincia".

* `life.js`: file con il codice Javascript. In questa prima fase il codice semplicemente viene attivato alla pressione del tasto "Comincia". Si entra nella funzione `eseguiProgrammaLife()` che per il momento si limita a nascondere il `<div>` di setup e poi a costruire la griglia.

La griglia viene costruita tramite un Canvas HTML. I Canvas sono utilizzati proprio per fare grafica "al volo" su una pagina HTML. Le operazioni grafiche sono realizzate proprio tramite funzioni javascript.

```Javascript
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
  numeroRighe = nrows;
  numeroColonne = ncols

  // nasconde i campi per la lettura delle dimensioni del campo
  MostraNascondi('N');

  // disegna il campo di gioco
  disegnaCampo();
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
function disegnaCampo()
{
  div = document.getElementById("lifegameBoard");
  c.width = (cellsize + 1) * numeroColonne + 2;
  c.height = (cellsize + 1) * numeroRighe + 2;

  ctx.beginPath();
  drawGrid("#657b83")
  ctx.stroke();
  div.appendChild(c);
}

// -----------------------------------------------------------------------------
function drawGrid(color)
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
```


## Passo 2: riempimento della griglia di gioco con cellule vive

Abbiamo detto che il gioco della vita simula l'evoluzione di un insieme di cellule in base ad alcune regole che vedremo successivamente.

Quello che ci serve in questa fase è preparare le strutture dati che conservano lo stato del nostro campo. Per questo ci servirà una matrice bidimensionale di dimensione pari al numero di righe per il numero di colonne del nostro campo da gioco. Se un item di questa matrice contiene il valore "1" (l'intero uno) vuol dice che in quella posizione c'è una cellula viva, altrimenti contiene 0 (zero) e vuol dire che in quella posizione non c'è una cellula.

Successivamente coloreremo il campo da gioco in modo da rispecchiare il contenuto della matrice. Dove c'è un uno coloreremo la cella di un colore vivo, altrimenti la lasceremo del colore dello sfondo.

### Preparazione della matrice

Modifichiamo il programma `life.js` nel seguente modo:

* All'inizio aggiungiamo la dichiarazione della variabile `lifeA` che rappresenta la nostra matrice della vita. Aggiungiamo anche la definizione dei colori che vogliamo usare per colorare le celle:

```Javascript
var lifeA = [];                   // <-- aggiunta al passo 2

var cellAliveColor = "#cb4b16";   // <-- aggiunta al passo 2
var cellDeadColor = "#073642";    // <-- aggiunta al passo 2
```
* Modifichiamo quindi la nostra funzione principale aggiungendo alla fine le seguenti istruzioni:

```Javascript
  // Prepara la matrice Life
  allocaMemoriaPerMatrice(lifeA);         // <-- aggiunta al passo 2

  // colora un po' di celle a casaccio
  inizializzaMatriceLifeACaso(lifeA);     // <-- aggiunta al passo 2
  coloraCelleInBaseAMatrice(lifeA);       // <-- aggiunta al passo 2
```

* E aggiungiamo l'implementazione delle tre funzioni `allocaMemoriaPerMatrice`, `inizializzaMatriceLifeACaso` e `coloraCelleInBaseAMatrice`:

```Javascript
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
```

A questo punto proviamo il gioco: vedremo che una volta cliccato il tasto "Comincia" apparirà in nostro campo da gioco con alcune celle colorate (più o meno una su quattro).


## Passo 3: il gioco della vita

In questo passo vediamo il gioco della vita vero e proprio.
Come abbiamo visto, si tratta di un automa cellulare in cui in ognuna delle celle del nostro tavolo da gioco ci può essere una cella viva oppure no.

La distribuzione delle cellule però evolve seguendo delle regole che dipendono dallo stato delle celle vicine. Citando [Wikipedia](https://it.wikipedia.org/wiki/Gioco_della_vita):

* Qualsiasi cella viva con meno di due celle vive adiacenti muore, come per effetto d'isolamento;
* Qualsiasi cella viva con due o tre celle vive adiacenti sopravvive alla generazione successiva;
* Qualsiasi cella viva con più di tre celle vive adiacenti muore, come per effetto di sovrappopolazione;
* Qualsiasi cella morta con esattamente tre celle vive adiacenti diventa una cella viva, come per effetto di riproduzione.

Per calcolare un'iterazione abbiamo bisogno di una seconda matrice. Aggiungiamo quindi una variabile `lifeB[]` e modifichiamo la funzione principale nel seguente modo:

```Javascript
var lifeB = [];                   // <-- aggiunta al passo 3
...

async function eseguiProgrammaLife(nrows, ncols)
{
  // salva il numero di righe e di colonne in due variabili
  // globali che saranno utilizzate nel seguito dal resto del Programma
  numeroRighe = nrows;
  numeroColonne = ncols

  // nasconde i campi per la lettura delle dimensioni del campo
  MostraNascondi('N');

  // disegna il campo di gioco
  disegnaCampo();

  // Prepara la matrice Life
  allocaMemoriaPerMatrice(lifeA);         // <-- aggiunta al passo 2
  allocaMemoriaPerMatrice(lifeB);         // <-- aggiunta al passo 3

  // colora un po' di celle a casaccio
  inizializzaMatriceLifeACaso(lifeA);     // <-- aggiunta al passo 2
  coloraCelleInBaseAMatrice(lifeA);       // <-- aggiunta al passo 2

  // Codice nuovo inserito nel passo 3 ----------
  while (1)
  {
    await sleep(200);
    calcolaProssimaGenerazione(lifeA, lifeB);
    coloraCelleInBaseAMatrice(lifeB);
    await sleep(200);
    calcolaProssimaGenerazione(lifeB, lifeA);
    coloraCelleInBaseAMatrice(lifeA);
  }
  // --------------------------------------------
}
```

N.B.: non dimenticare l'inserimento della parola chiave `async` nella definizione della funzione.

A questo punto non ci rimane altro che realizzare la funzione `calcolaProssimaGenerazione()` che prende come input un primo argomento con lo stato corrente della nostra matrice della vita e ritorna nella matrice passata come secondo argomento il nuovo stato della matrice della vita.

```Javascript
```






_** TO BE COMPLETED **_
