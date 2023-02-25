#!/usr/bin/env python3
# -*- coding: utf-8 -*-


import sys,json
from classiBase import gameMap,mapObject,room


f_out = open('map.json')
with open('map.json','r') as fp:
    riga = fp.read()
    codice = str("").join([riga])

totale = json.loads(codice)
#print("{}".format(totale["maxdim"]))

mappa = gameMap(totale["maxdim"][0],totale["maxdim"][1])

for stanza in totale["map"]:
    nuova = room(stanza["name"],stanza["description"])
    #nuova.setBM(stanza["bonusmalus"])
    nuova.foo("ciao")
    mappa.setCell(stanza["pos"][0],stanza["pos"][1],nuova)

print(mappa)

sys.exit()
