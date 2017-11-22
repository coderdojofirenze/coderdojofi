# Coderdojo di Firenze - HTML / Javascript - Tutorial Life

Scopo del presente tutorial è di realizzare un versione HTML / Javascript del ["**gioco della vita**"](https://it.wikipedia.org/wiki/Gioco_della_vita)  o _life_ del matematico inglese John Conway.
Si tratta del più famoso esempio di automa cellulare: un modello matematico usato per descrivere l'evoluzione di sistemi complessi. Si rimanda alla vasta bibliografia sull'argomento per maggiori dettagli.

Qui basta sapere che l'automa life... **FIXME --- TO BE COMPLETED**

## Passo 1: creare una griglia con HTML+CSS+Javascript


## Passo 2: riempimento della griglia di gioco con cellule vive

Per accendere o spegnere una cellula si utilizza la funzione `fillCell()`, che colora il contenuto di una cella della griglia di un colore a piacere.
Se la cella contiene una cellula viva, questa viene colorata con un colore brillante, altrimenti rimane colorata con il colore dello sfondo. Si definiscono quindi due funzioni `cellAlive()` che chiama `fillCell()` con il colore brillante e `cellDead()` che la chiama con il colore di background.
