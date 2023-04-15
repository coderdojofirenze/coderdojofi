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


import os,json
from copy import deepcopy
from classiBase import gameMap,mapObject,room,character,thing


# Classe gioco
class game:

    def __init__(self,json_ch,json_map):
        """
        inizializzazione del gioco attraverso lettura del file JSON

        json_ch (str): path e nome del file json per personaggi e oggetti
        json_map (str): path e nome del file json per luoghi
        """

        if not os.path.exists(json_ch):
            #TODO: mesg errore
            return False
        if not os.path.exists(json_map):
            #TODO: mesg errore
            return False

        # oggetto temporaneo personaggi (chars.json) e oggetti (map.json)
        cod_p = self.loadJSON(json_ch)

        # oggetto temporaneo luoghi mappa
        cod_m = self.loadJSON(json_map)

        # inizializzazione mappa, personaggi e oggetti
        self.gameMap = gameMap(cod_p,cod_m)

        # inizializza eroe come oggetto character
        #TODO: impostare vitalità e oggetti base (anche nulla in realtà...)
        self.hero = character("eroe","Protagonista del gioco")
        self.hero.setStrenght(5)

        # estrazione oggetti come dotazione di partenza
        for th_name in cod_p["heroInventory"]: #prendi oggetti in lista (nomi che riferiscono oggetti - come oggetti in stanza)
            if th_name in self.gameMap.things:
                self.hero.addThing(deepcopy(self.gameMap.things[th_name]))

        end = False
        while end != True:
            end = self.play()
            #TODO: eventuali operazioni aggiuntive di contorno al gioco
        print("Fine del gioco")


    def loadJSON(self,file):
        """
        funzione comune per la lettura dei file di configurazione json
        """
        with open(file,'r') as fp:
            riga = fp.read()
            codice = str("").join([riga])
        return json.loads(codice)


    def play(self):
        """
        singolo passo del gioco
        """
        # in base alla posizione del giocatore:
        actual_cell = self.gameMap.getHeroCell()

        #debug
        print("game.play(): pos attuale: {}".format(self.gameMap.getPosHero()))

        ret = False

        # 0. mostra descrizione del luogo - a meno che la posizione non sia mancata dal passo precedente
        room_desc = actual_cell.descRoom()
        out = str("\n\n").join([room_desc["desc"]
            ,str("\n").join(["",room_desc["chars"]])
            ,str("\n").join(["- Oggetti presenti: ",room_desc["things"]])
        ])
        print("{}".format(out))
        
        #TODO
        # 1. se il luogo influisce sulla salute (es. deserto, fontana curativa), somma/togli punti
        if actual_cell.getBM() != 0:
            None
        # 2. se è presente un personaggio aggressivo (es. drago), effettua il suo attacco
        # 3. segnala le direzioni disponibili
        # 4. leggi il comando del personaggio ed esegui di conseguenza

        cmd = input("Comando: ")
        ret = self.parse(cmd,actual_cell)
        return ret


    def parse(self,cmd,cell):
        """
        parse() - interpreta comando

        cmd(str): comando da interpretare
        cell(obj): cella attuale

        restituisce
            True: comando compreso
            False: qualcosa è andato storto
        """

        if(cmd == ""):
            print("comando sconosciuto: {}".format(cmd))
            return False

        verbs = [
            "n","s","e","o" # direzioni (1 parola)
            ,"usa","prendi","lascia","acquista" # azioni con oggetti (1,2 parole)
            ,"attacca","parla_con" # azioni con personaggi (1 parola)
            ,"inventario","inv","salute" # richiesta condizioni eroe (senza parole)
            ,"esci" # ,"salva","carica" # comandi del gioco (0,1 parole)
        ]

        parts = cmd.split(" ")

        #TODO: fare un metodo a parte (espandibile)
        if(parts[0] in verbs):
            #TODO: lista azioni
            if parts[0] in ["n","s","e","o"]:
                # TODO: spostati se c'è un ambiente raggiungibile
                ret = self.moveHero(parts[0])
                if ret == False:
                    print("Non puoi andare di là!")
            elif parts[0] == "usa":
                # TODO: usa oggetto parts[1] se è nell'inventario
                pass
            elif parts[0] == "prendi":
                if cell.inInventory(parts[1]) == False:
                    print("Non trovo {}!".format(parts[1]))
                else:
                    print("DEBUG: implementare codice")
                    # TODO: prendi oggetto parts[1] dall'ambiente
                    pass
            elif parts[0] in ["inventario","inv"]:
                # TODO: lista oggetti nell'inventario
                print("Questo è quello che possiedi:")
                #TODO: sfruttare getInventory() della classe mapObject
                for th in self.hero.inventory:
                    print("{}".format(th.descObj()))
            elif parts[0] == "salute":
                print("Il tuo livello di salute è {}".format(self.hero.getStrenght()))
            elif parts[0] in ["esci","exit","x"]:
                # TODO: avvia procedura di uscita dal gioco
                return True
            print(" ---\n")
        else:
            print("comando sconosciuto: {}\n ---\n".format(cmd))
            return False


    def loadHero(self,cod_m):
        """
        cod_m (obj): struttura JSON caricata in partenza con indicazioni oggetti
        """
        hero_things = {}
        for obj_name in elements["heroInventory"]:
            if obj_name in self.map.things:
                hero_things[obj_name] = deepcopy(self.map.getThing(obj_name))
        self.hero.setThings(hero_things)


    def moveHero(self,dr):
        """
        df (str): direzione n,s,e,o
        """
        pos = self.gameMap.getPosHero()

        if dr == "n":
            pos[1] += 1
        elif dr == "s":
            pos[1] -= 1
        elif dr == "e":
            pos[0] -= 1
        elif dr == "o":
            pos[0] += 1
        else:
            return False

        if(self.gameMap.getCell(pos[0],pos[1]) != False):
            self.gameMap.setPosHero(pos[0],pos[1])
            return True
        else:
            return False


def main(args):

    partita = game('chars.json','map.json')

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
