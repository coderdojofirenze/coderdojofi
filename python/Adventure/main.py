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


def parse(cmd):
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
    if(parts[0] in verbs):
        #TODO: lista azioni
        if parts[0] in ["n","s","e","o"]:
            # TODO: spostati se c'è un ambiente raggiungibile
        elif parts[0] == "usa":
            # TODO: usa oggetto parts[1] se è nell'inventario
        elif parts[0] == "prendi":
            # TODO: prendi oggetto parts[1] dall'ambiente se c'è
        elif parts[0] == "inventario":
            # TODO: lista oggetti nell'inventario
        elif parts[0] == "salute":
            # TODO: mostra livello energetico
        elif parts[0] == "esci":
            # TODO: avvia procedura di uscita dal gioco
    else:
        print("comando sconosciuto: {}".format(cmd))
        return False


def main(args):

# Schema base del ciclo
# 1. descrizione ambiente
#   1a. lettura descrizione da
# 2. descrizione personaggi
# 3. lettura e ionterpretazione azione
# 4. conseguenze

    return 0

if __name__ == '__main__':
    import sys
    sys.exit(main(sys.argv))
