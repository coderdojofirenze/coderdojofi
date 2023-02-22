#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
#  main.py
#
#  Copyright 2023 giacomo <gmx@Vega>
#
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#  MA 02110-1301, USA.
#
#


import json


class mappa:
    def __init__(self):
        pass


# Classe gioco
class gioco:

    def __init__(self):
        """
        inizializzazione del gioco attraverso lettura del file JSON
        """
        # - lettura definizione di ambienti, personaggi (contenuti in ambienti) e oggetti (contenuti in ambienti e oggetti)
        personaggi_tmp = self.loadjson('chars.json')
        luoghi_tmp = self.loadjson("rooms.json")
        mappa_tmp = self.loadjson("map.json")

        #TODO: creare oggetto mappa e usarne i metodi per popolarla ()
        #print("personaggio: {}".format(personaggi_tmp["characters"][1]))


    def loadjson(self,file):
        with open(file,'r') as fp:
            riga = fp.read()
            codice = str("").join([riga])
        return json.loads(codice)


        #TODO:
        # - impostazione della mappa (ambienti alle coordinate richieste)
        # - impostazione e posizionamento dell'eroe


    def gioca(self):
        """
        singolo passo del gioco
        """
        #TODO
        # in base alla posizione del giocatore:
        # 0. mostra descrizione del luogo - a meno che la posizione non sia mancata dal passo precedente
        # 1. se il luogo influisce sulla salute (es. deserto, fontana curativa), somma/togli punti
        # 2. se è presente un personaggio aggressivo (es. drago), effettua il suo attacco
        # 3. leggi il comando del personaggio ed esegui di conseguenza
        pass


    def parse(self,cmd):
        """
        parse() - interpreta comando

        stringa(str): comando da interpretare

        restituisce
            True: comando compreso
            False: qualcosa è andato storto
        """

        if(cmd == ""):
            print("comando sconosciuto: {}".format(cmd))
            return False

        verbs = [
            "n","s","e","o" # direzioni
            ,"usa","prendi" # azioni con oggetti
            ,"inventario" # lista oggetti posseduti
            ,"salute" # condizioni
            ,"esci"
        ]

        parts = cmd.split(" ")

        #TODO: fare un metodo a parte (espandibile)
        if(parts[0] in verbs):
            #TODO: lista azioni
            if parts[0] in ["n","s","e","o"]:
                # TODO: spostati se c'è un ambiente raggiungibile
                pass
            elif parts[0] == "usa":
                # TODO: usa oggetto parts[1] se è nell'inventario
                pass
            elif parts[0] == "prendi":
                # TODO: prendi oggetto parts[1] dall'ambiente se c'è
                pass
            elif parts[0] == "inventario":
                # TODO: lista oggetti nell'inventario
                pass
            elif parts[0] == "salute":
                # TODO: mostra livello energetico
                pass
            elif parts[0] == "esci":
                # TODO: avvia procedura di uscita dal gioco
                pass
        else:
            print("comando sconosciuto: {}".format(cmd))
            return False


def main(args):

    partita = gioco()

# Schema base del ciclo
# 1. descrizione ambiente
#   1a. lettura descrizione da
# 2. descrizione personaggi
# 3. lettura e interpretazione azione
# 4. conseguenze

    return 0

if __name__ == '__main__':
    import sys
    sys.exit(main(sys.argv))
