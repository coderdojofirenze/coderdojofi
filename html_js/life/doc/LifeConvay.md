# Coderdojo di Firenze - HTML / Javascript - Tutorial Life

Scopo del presente tutorial è di realizzare un versione HTML / Javascript del ["**gioco della vita**"](https://it.wikipedia.org/wiki/Gioco_della_vita)  o _life_ del matematico inglese John Conway.
Si tratta del più famoso esempio di automa cellulare: un modello matematico usato per descrivere l'evoluzione di sistemi complessi. Si rimanda alla vasta bibliografia sull'argomento per maggiori dettagli.

Qui basta sapere che l'automa life... **FIXME --- TO BE COMPLETED**

## Passo 1: creare una griglia con utilizzando un canvas

In questo primo passo scriveremo una pagina contenente una griglia di quadrati che costituirà la base per il nostro gioco. Per prima cosa tramite la pagina chiederemo la dimensione della griglia, poi la griglia sarà costruita con le dimensioni date utilizzando un Canvas.

Inoltre in questa fase diamo l'impostazione al nostro progetto utilizzando file separati: uno per il foglio di stile (CSS), uno per rappresentare la pagina HTLM e uno con il codice Javascript. Creiamo quindi tre file:

* `life.css`: file con la definizione di stile. Per il momento contiene solo i colori di background e foreground da assegnare a tutti gli oggetti. Per la scelta dei colori abbiamo preso spunto al tema ["Solarized"](http://ethanschoonover.com/solarized).

```CSS
body {
    background-color: #073642;
		color: #93a1a1;
}
```

* `life.html`: file con la definizione pagina HTML. Lo snippet di codice riportato sotto contiene la pagina intera, con commenti per spiegare il significato delle varie sezioni. Come si vede questa pagina include il file `life.js` che vedremo al prossimo punto e che conterrà il codice javascript che realizzerà il gioco.

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
        onclick="disegnaCampo(document.getElementById('altezza').value,
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

* `life.js`: file con il codice Javascript. In questa prima fase il codice semplicemente viene attivato alla pressione del tasto "Comincia". Si entra nella funzione `disegnaCampo()` che prima nasconde il `<div>` di setup e poi costruisce la griglia.
La griglia viene costruita tramite un Canvas HTML. I Canvas sono utilizzati proprio per costruire al volo oggetti grafica su una pagina HTML. Le operazioni grafiche sono realizzate proprio tramite funzioni javascript.

```Javascript
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
// Disegnol campo con le dimensioni date
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
}
```


## Passo 2: riempimento della griglia di gioco con cellule vive

Per accendere o spegnere una cellula si utilizza la funzione `fillCell()`, che colora il contenuto di una cella della griglia di un colore a piacere.
Se la cella contiene una cellula viva, questa viene colorata con un colore brillante, altrimenti rimane colorata con il colore dello sfondo. Si definiscono quindi due funzioni `cellAlive()` che chiama `fillCell()` con il colore brillante e `cellDead()` che la chiama con il colore di background.

_** TO BE COMPLETED **_
