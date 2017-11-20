// Variabili globali
var campo = []; //la variabile campo è un'array
var finito = false;

// Serve per mostrare e nascondere gli item per inserire
// le informazioni del campo da creare
function MostraNascondi(x)
{
  if (x=='N') document.getElementById('setup').style.display='none';
  else document.getElementById('setup').style.display='block';
}

// Disegna la tabella con le dimensioni date
function disegnaTabella(numeroRighe, numeroColonne)
{
  x = '<table>';
  for (riga = 0; riga < numeroRighe; riga++)
  {
    x = x + '<tr>';

    campo[riga] = []; //il singolo elemento di campo è a sua volta un array

    for (colonna = 0; colonna < numeroColonne; colonna++)
    {
      // ogni cella deve avere un id univoco nella forma:
      //    <row>:<column>
      // per esempio la cella alla riga 2 colonna 12 avra' id:
      //    2:12
      id = riga + ';' + colonna;
      x = x + '<td class="griglia" id="' + id + '" >'+'</td>';

      // vedremo successivamente a cosa serve campo,
      // per il momento inizializziamolo
      campo[riga][colonna]=-1;
    }
    x = x + '</tr>';
  }
  document.getElementById('lifegame').innerHTML = x + '</table>';
  MostraNascondi('N');
  finito=false;
}
